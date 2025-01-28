import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useDrag, useDrop } from "react-dnd"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const componentTypes = [
  { id: "header", label: "Header" },
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
  { id: "footer", label: "Footer" },
]

const DraggableComponent = ({ id, children, moveComponent }) => {
  const [, drag] = useDrag({
    type: "COMPONENT",
    item: { id },
  })

  const [, drop] = useDrop({
    accept: "COMPONENT",
    hover(item) {
      if (item.id !== id) {
        moveComponent(item.id, id)
      }
    },
  })

  return (
    <div ref={(node) => drag(drop(node))} className="bg-gray-100 p-4 mb-2 rounded cursor-move">
      {children}
    </div>
  )
}

export function WebsiteBuilder() {
  const [components, setComponents] = useState([])
  const [websiteName, setWebsiteName] = useState("")
  const [loading, setLoading] = useState(false)

  const moveComponent = (draggedId, hoverId) => {
    const draggedIndex = components.findIndex((c) => c.id === draggedId)
    const hoverIndex = components.findIndex((c) => c.id === hoverId)
    const newComponents = [...components]
    newComponents.splice(draggedIndex, 1)
    newComponents.splice(hoverIndex, 0, components[draggedIndex])
    setComponents(newComponents)
  }

  const addComponent = (componentType) => {
    setComponents([...components, { id: `${componentType}-${Date.now()}`, type: componentType }])
  }

  const removeComponent = (id) => {
    setComponents(components.filter((component) => component.id !== id))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await axios.post("/api/websites", { name: websiteName, components })
      toast({
        title: "Succes",
        description: "Website succesvol opgeslagen.",
      })
    } catch (error) {
      console.error("Error saving website:", error)
      toast({
        title: "Error",
        description: "Kon website niet opslaan. Probeer het later opnieuw.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Website Builder</h2>
          <Input
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            placeholder="Website naam"
            className="mb-4"
          />
          <div className="min-h-[400px] border-2 border-dashed p-4">
            {components.map((component) => (
              <DraggableComponent key={component.id} id={component.id} moveComponent={moveComponent}>
                <div className="flex justify-between items-center">
                  <span>{component.type}</span>
                  <Button onClick={() => removeComponent(component.id)} variant="destructive" size="sm">
                    Verwijder
                  </Button>
                </div>
              </DraggableComponent>
            ))}
          </div>
          <Button onClick={handleSave} disabled={loading} className="mt-4">
            {loading ? "Opslaan..." : "Opslaan"}
          </Button>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Componenten</h3>
          {componentTypes.map((type) => (
            <Button key={type.id} onClick={() => addComponent(type.id)} className="mr-2 mb-2">
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </DndProvider>
  )
}

