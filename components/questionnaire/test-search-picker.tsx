"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { labTests, type LabTest } from "@/lib/data/lab-tests"

const UNAVAILABLE_MESSAGE =
  "Nie znaleźliśmy tego badania w dostępnej ofercie. Informacji, czy możesz je wykonać podczas wizyty, udzieli osoba pobierająca materiał do badań w dniu pobrania."

interface TestSearchPickerProps {
  activeTestIds: Set<number>
  onAddToEmployer: (test: LabTest) => void
  onAddToAdditional: (test: LabTest) => void
}

export function TestSearchPicker({
  activeTestIds,
  onAddToEmployer,
  onAddToAdditional,
}: TestSearchPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [pendingTest, setPendingTest] = React.useState<LabTest | null>(null)

  const availableTests = React.useMemo(
    () => labTests.filter(t => !activeTestIds.has(t.id)),
    [activeTestIds]
  )

  const filteredTests = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return availableTests
    return availableTests.filter(t => t.nazwa.toLowerCase().includes(query))
  }, [availableTests, search])

  const showUnavailableHint =
    search.trim().length >= 2 && filteredTests.length === 0

  const handleSelectTest = (test: LabTest) => {
    setPendingTest(test)
    setOpen(false)
    setSearch("")
  }

  const handleAddToEmployer = () => {
    if (!pendingTest) return
    onAddToEmployer(pendingTest)
    setPendingTest(null)
  }

  const handleAddToAdditional = () => {
    if (!pendingTest) return
    onAddToAdditional(pendingTest)
    setPendingTest(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5" />
          Wyszukaj interesujące badanie
        </CardTitle>
        <CardDescription>
          Dobierz dodatkowe badania z katalogu i dodaj je do pakietu pracodawcy lub do koszyka płatnego
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              {pendingTest ? pendingTest.nazwa : "Wpisz nazwę badania..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Szukaj badania..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                {filteredTests.length === 0 ? (
                  <CommandEmpty>
                    {showUnavailableHint ? (
                      <p className="px-2 py-3 text-left text-sm text-muted-foreground leading-relaxed">
                        {UNAVAILABLE_MESSAGE}
                      </p>
                    ) : (
                      "Wpisz nazwę badania, aby wyszukać"
                    )}
                  </CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredTests.map((test) => (
                      <CommandItem
                        key={test.id}
                        value={test.nazwa}
                        onSelect={() => handleSelectTest(test)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            pendingTest?.id === test.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {test.nazwa}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {showUnavailableHint && !open && (
          <p className="rounded-lg border border-dashed bg-muted/50 p-4 text-sm text-muted-foreground leading-relaxed">
            {UNAVAILABLE_MESSAGE}
          </p>
        )}

        {pendingTest && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium">Wybrane badanie: {pendingTest.nazwa}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" onClick={handleAddToEmployer}>
                Dodaj do pakietu pracodawcy
              </Button>
              <Button variant="secondary" className="flex-1" onClick={handleAddToAdditional}>
                Dodaj do badań dodatkowo płatnych
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
