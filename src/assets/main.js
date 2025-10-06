  const { createApp, ref } = Vue

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  
  createApp({
    setup() {
      let filamentSelected = ref("0")
      let energy = ref() // costo energia electrica x hora 0.7
      let deprecation = ref() // costo depreciacion del equipo por hora 0.5
      let workingCost = ref() // costo de operacion 5
      let postprocessingCost = ref() // costo del post procesado 3
      let impressionTime = ref()
      let profit = ref() // porcentaje de ganancia
      let tax = ref() // impuestos
      let impressionWeight = ref()
      const filamentList = ref([
        {
          text: "Elige un tipo de filamento",
          cost: "0",
          description: "PLA basico",
          marca: "Inkfaill"
        },
        {
          text: "PLA",
          cost: "50",
          description: "PLA basico",
          marca: "Inkfaill"
        },
        {
          text: "ABS",
          cost: "70",
          description: "ABS basico",
          marca: "Inkfaill"
        }

      ])
      let subtotal = ref(0)
      let subtotalWithProfit = ref(0)
      let totalTax = ref(0)
      let total = ref(0)
      calculate = () => {
        const totalEnergy = parseFloat(energy.value) * parseFloat(impressionTime.value)
        const totalDeprecation = parseFloat(deprecation.value) * parseFloat(impressionTime.value)
        const totalMaterialCost = parseFloat(impressionWeight.value) / 1000 * parseFloat(filamentSelected.value)
        subtotal.value = totalEnergy + totalDeprecation + totalMaterialCost + parseFloat(workingCost.value) + parseFloat(postprocessingCost.value)
        subtotalWithProfit.value = Math.round(( (subtotal.value * ( 1 + (parseFloat(profit.value) / 100))) - subtotal.value) * 100) / 100
        totalTax.value =  Math.round( ((subtotalWithProfit.value +  subtotal.value) * parseFloat(tax.value) / 100) * 100) / 100
        total.value =  Math.round( (subtotal.value + subtotalWithProfit.value + totalTax.value) * 100) / 100
      }
      restart = () => {
        filamentSelected.value = "0"
        impressionTime.value = null
        profit.value = null
        tax.value = null
        impressionWeight.value = null
        subtotal.value = 0
        subtotalWithProfit.value = 0
        totalTax.value = 0
        total.value = 0


      energy.value = null // costo energia electrica x hora 0.7
      deprecation.value = null // costo depreciacion del equipo por hora 0.5
      workingCost.value = null // costo de operacion 5
      postprocessingCost.value = null

      }
      return {
        impressionTime,
        filamentSelected,
        filamentList,
        impressionWeight,
        tax, profit,
        calculate, restart,
        subtotal, subtotalWithProfit, totalTax, total,
        energy,deprecation,workingCost,postprocessingCost
      }
    }
  }).mount('#app')