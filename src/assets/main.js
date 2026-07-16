    const { createApp, ref } = Vue

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  
  createApp({
    setup() {
      let activeTab = ref('filamentos')
      
      const changeTab = (tab) => {
        activeTab.value = tab
      }

      // ── Theme ──────────────────────────────────────────────
      const storedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const startDark = storedTheme ? storedTheme === 'dark' : prefersDark
      const isDark = ref(startDark)

      // Sync the html class on startup
      if (startDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      const toggleTheme = () => {
        isDark.value = !isDark.value
        if (isDark.value) {
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
        }
      }
      // ──────────────────────────────────────────────────────

      let impressionTime = ref()

      // Each entry: { filamentSelected: null, impressionWeight: null }
      const filamentEntries = ref([
        { filamentSelected: null, impressionWeight: null }
      ])

      const addFilamentEntry = () => {
        filamentEntries.value.push({ filamentSelected: null, impressionWeight: null })
      }

      const removeFilamentEntry = (index) => {
        if (filamentEntries.value.length > 1) {
          filamentEntries.value.splice(index, 1)
        }
      }
      let additionalComments = ref('')
      let commentsTab = ref('editor')

      const renderMarkdown = (text) => {
        if (!text) return ''
        try {
          return marked.parse(text)
        } catch (e) {
          return text
        }
      }

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

      let energy = ref(savedSettings.energy !== undefined && savedSettings.energy !== null ? savedSettings.energy : 0.7)
      let deprecation = ref(savedSettings.deprecation !== undefined && savedSettings.deprecation !== null ? savedSettings.deprecation : 0.5)
      let workingCost = ref(savedSettings.workingCost !== undefined && savedSettings.workingCost !== null ? savedSettings.workingCost : 5)
      let postprocessingCost = ref(savedSettings.postprocessingCost !== undefined && savedSettings.postprocessingCost !== null ? savedSettings.postprocessingCost : 3)
      let packagingCost = ref(savedSettings.packagingCost !== undefined && savedSettings.packagingCost !== null ? savedSettings.packagingCost : 2)
      let profit = ref(savedSettings.profit !== undefined && savedSettings.profit !== null ? savedSettings.profit : 30)
      let tax = ref(savedSettings.tax !== undefined && savedSettings.tax !== null ? savedSettings.tax : 18)

      let businessName = ref(savedSettings.businessName || 'CreacionesJoJo')
      let businessSubtitle = ref(savedSettings.businessSubtitle || '3D Cost Expert')
      let currency = ref(savedSettings.currency || '$')
      let quotationTitle = ref(savedSettings.quotationTitle || 'Cotización de Impresión 3D')

      const saveSettings = () => {
        const settings = {
          energy: energy.value,
          deprecation: deprecation.value,
          workingCost: workingCost.value,
          postprocessingCost: postprocessingCost.value,
          packagingCost: packagingCost.value,
          profit: profit.value,
          tax: tax.value,
          businessName: businessName.value,
          businessSubtitle: businessSubtitle.value,
          currency: currency.value,
          quotationTitle: quotationTitle.value
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
          { text: "PLA", cost: "50", marca: "Inkfaill", color: "Blanco", tipo: "Filamento" },
          { text: "ABS", cost: "70", marca: "Inkfaill", color: "Negro", tipo: "Filamento" }
        ]
      }

      const filamentList = ref(loadFilaments())
      
      const filamentForm = ref({
        text: "",
        cost: "",
        marca: "",
        color: "",
        tipo: "Filamento"
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
          color: filamentForm.value.color,
          tipo: filamentForm.value.tipo || 'Filamento'
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
          color: current.color,
          tipo: current.tipo || 'Filamento'
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
          color: "",
          tipo: "Filamento"
        }
        editingIndex.value = -1
      }

      let subtotal = ref(0)
      let subtotalWithProfit = ref(0)
      let totalTax = ref(0)
      let total = ref(0)
      let calculated = ref(false)

      const calculate = () => {
        if (!impressionTime.value || parseFloat(impressionTime.value) <= 0) {
          alert('Por favor, ingresa un tiempo de impresión válido (mayor a 0).')
          return
        }
        for (let i = 0; i < filamentEntries.value.length; i++) {
          const entry = filamentEntries.value[i]
          if (!entry.filamentSelected) {
            alert(`Por favor, selecciona un filamento para el material #${i + 1}.`)
            return
          }
          if (!entry.impressionWeight || parseFloat(entry.impressionWeight) <= 0) {
            alert(`Por favor, ingresa un peso válido (mayor a 0) para el material #${i + 1}.`)
            return
          }
        }

        const time = parseFloat(impressionTime.value || 0)
        const totalEnergy = parseFloat(energy.value || 0) * time
        const totalDeprecation = parseFloat(deprecation.value || 0) * time

        let totalMaterialCost = 0
        for (const entry of filamentEntries.value) {
          const filamentCost = entry.filamentSelected?.cost ? parseFloat(entry.filamentSelected.cost) : 0
          totalMaterialCost += (parseFloat(entry.impressionWeight || 0) / 1000) * filamentCost
        }

        subtotal.value = totalEnergy + totalDeprecation + totalMaterialCost
          + parseFloat(workingCost.value || 0)
          + parseFloat(postprocessingCost.value || 0)
          + parseFloat(packagingCost.value || 0)
        subtotalWithProfit.value = Math.round(((subtotal.value * (1 + (parseFloat(profit.value || 0) / 100))) - subtotal.value) * 100) / 100
        totalTax.value = Math.round(((subtotalWithProfit.value + subtotal.value) * parseFloat(tax.value || 0) / 100) * 100) / 100
        total.value = Math.round((subtotal.value + subtotalWithProfit.value + totalTax.value) * 100) / 100
        calculated.value = true
      }

      const restart = () => {
        impressionTime.value = null
        filamentEntries.value = [{ filamentSelected: null, impressionWeight: null }]
        additionalComments.value = ''
        subtotal.value = 0
        subtotalWithProfit.value = 0
        totalTax.value = 0
        total.value = 0
        calculated.value = false

        // Restablecer costos de operación a sus valores guardados o predeterminados
        const currentSettings = loadSettings()
        energy.value = currentSettings.energy !== undefined && currentSettings.energy !== null ? currentSettings.energy : 0.7
        deprecation.value = currentSettings.deprecation !== undefined && currentSettings.deprecation !== null ? currentSettings.deprecation : 0.5
        workingCost.value = currentSettings.workingCost !== undefined && currentSettings.workingCost !== null ? currentSettings.workingCost : 5
        postprocessingCost.value = currentSettings.postprocessingCost !== undefined && currentSettings.postprocessingCost !== null ? currentSettings.postprocessingCost : 3
        packagingCost.value = currentSettings.packagingCost !== undefined && currentSettings.packagingCost !== null ? currentSettings.packagingCost : 2
        profit.value = currentSettings.profit !== undefined && currentSettings.profit !== null ? currentSettings.profit : 30
        tax.value = currentSettings.tax !== undefined && currentSettings.tax !== null ? currentSettings.tax : 18
      }

      const exportPDF = () => {
        window.print()
      }

      return {
        activeTab, changeTab,
        isDark, toggleTheme,
        impressionTime,
        filamentEntries, addFilamentEntry, removeFilamentEntry,
        filamentList,
        tax, profit,
        calculate, restart,
        subtotal, subtotalWithProfit, totalTax, total, calculated,
        energy, deprecation, workingCost, postprocessingCost, packagingCost,
        filamentForm, editingIndex, saveFilament, editFilament, deleteFilament, clearForm, saveSettings,
        exportPDF, businessName, businessSubtitle, currency, quotationTitle,
        additionalComments, commentsTab, renderMarkdown
      }
    }
  }).mount('#app')