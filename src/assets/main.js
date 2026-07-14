    const { createApp, ref } = Vue

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  
  createApp({
    setup() {
      let activeTab = ref('cotizacion')
      
      const changeTab = (tab) => {
        activeTab.value = tab
      }

      let filamentSelected = ref("0")
      let impressionTime = ref()
      let impressionWeight = ref()

      // Load operation settings from localStorage
      const loadSettings = () => {
        const stored = localStorage.getItem('operation_settings')
        if (stored) {
          try {
            return JSON.parse(stored)
          } catch(e) {}
        }
        return {}
      }
      const savedSettings = loadSettings()

      let energy = ref(savedSettings.energy || null)
      let deprecation = ref(savedSettings.deprecation || null)
      let workingCost = ref(savedSettings.workingCost || null)
      let postprocessingCost = ref(savedSettings.postprocessingCost || null)
      let packagingCost = ref(savedSettings.packagingCost || null)
      let profit = ref(savedSettings.profit || null)
      let tax = ref(savedSettings.tax || null)

      const saveSettings = () => {
        const settings = {
          energy: energy.value,
          deprecation: deprecation.value,
          workingCost: workingCost.value,
          postprocessingCost: postprocessingCost.value,
          packagingCost: packagingCost.value,
          profit: profit.value,
          tax: tax.value
        }
        localStorage.setItem('operation_settings', JSON.stringify(settings))
        alert('¡Configuración guardada exitosamente!')
      }

      // CRUD Filaments Logic
      const loadFilaments = () => {
        const stored = localStorage.getItem('filaments')
        if (stored) {
          try {
            return JSON.parse(stored)
          } catch(e) {
            console.error("Error al cargar filamentos de localStorage", e)
          }
        }
        // Default filaments
        return [
          { text: "PLA", cost: "50", marca: "Inkfaill", color: "Blanco" },
          { text: "ABS", cost: "70", marca: "Inkfaill", color: "Negro" }
        ]
      }

      const filamentList = ref(loadFilaments())
      
      const filamentForm = ref({
        text: "",
        cost: "",
        marca: "",
        color: ""
      })
      const editingIndex = ref(-1)

      const saveToStorage = () => {
        localStorage.setItem('filaments', JSON.stringify(filamentList.value))
      }

      const saveFilament = () => {
        if (!filamentForm.value.text || !filamentForm.value.cost || !filamentForm.value.marca || !filamentForm.value.color) {
          alert("Por favor completa todos los campos del filamento.")
          return
        }

        const newFilament = {
          text: filamentForm.value.text,
          cost: filamentForm.value.cost.toString(),
          marca: filamentForm.value.marca,
          color: filamentForm.value.color
        }

        if (editingIndex.value === -1) {
          filamentList.value.push(newFilament)
        } else {
          filamentList.value[editingIndex.value] = newFilament
          editingIndex.value = -1
        }

        saveToStorage()
        clearForm()
      }

      const editFilament = (index) => {
        editingIndex.value = index
        const current = filamentList.value[index]
        filamentForm.value = {
          text: current.text,
          cost: current.cost,
          marca: current.marca,
          color: current.color
        }
      }

      const deleteFilament = (index) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el filamento "${filamentList.value[index].text}"?`)) {
          filamentList.value.splice(index, 1)
          saveToStorage()
          if (editingIndex.value === index) {
            clearForm()
          } else if (editingIndex.value > index) {
            editingIndex.value--
          }
        }
      }

      const clearForm = () => {
        filamentForm.value = {
          text: "",
          cost: "",
          marca: "",
          color: ""
        }
        editingIndex.value = -1
      }

      let subtotal = ref(0)
      let subtotalWithProfit = ref(0)
      let totalTax = ref(0)
      let total = ref(0)

      const calculate = () => {
        const totalEnergy = parseFloat(energy.value || 0) * parseFloat(impressionTime.value || 0)
        const totalDeprecation = parseFloat(deprecation.value || 0) * parseFloat(impressionTime.value || 0)
        const totalMaterialCost = (parseFloat(impressionWeight.value || 0) / 1000) * parseFloat(filamentSelected.value || 0)
        subtotal.value = totalEnergy + totalDeprecation + totalMaterialCost + parseFloat(workingCost.value || 0) + parseFloat(postprocessingCost.value || 0) + parseFloat(packagingCost.value || 0)
        subtotalWithProfit.value = Math.round(( (subtotal.value * ( 1 + (parseFloat(profit.value || 0) / 100))) - subtotal.value) * 100) / 100
        totalTax.value =  Math.round( ((subtotalWithProfit.value +  subtotal.value) * parseFloat(tax.value || 0) / 100) * 100) / 100
        total.value =  Math.round( (subtotal.value + subtotalWithProfit.value + totalTax.value) * 100) / 100
      }

      const restart = () => {
        filamentSelected.value = "0"
        impressionTime.value = null
        profit.value = null
        tax.value = null
        impressionWeight.value = null
        subtotal.value = 0
        subtotalWithProfit.value = 0
        totalTax.value = 0
        total.value = 0
        energy.value = null
        deprecation.value = null
        workingCost.value = null
        postprocessingCost.value = null
        packagingCost.value = null
      }

      return {
        activeTab, changeTab,
        impressionTime,
        filamentSelected,
        filamentList,
        impressionWeight,
        tax, profit,
        calculate, restart,
        subtotal, subtotalWithProfit, totalTax, total,
        energy, deprecation, workingCost, postprocessingCost, packagingCost,
        filamentForm, editingIndex, saveFilament, editFilament, deleteFilament, clearForm, saveSettings
      }
    }
  }).mount('#app')