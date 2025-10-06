  const { createApp, ref } = Vue

  createApp({
    setup() {
      let filamentSelected = ref("0")
      const energy = ref(0.7) // costo energia electrica x hora
      const deprecation = ref(0.5) // costo depreciacion del equipo por hora
      const workingCost = 5 // costo de operacion
      const postprocessingCost = 3 // costo del post procesado
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
        const totalEnergy = energy.value * parseFloat(impressionTime.value)
        const totalDeprecation = deprecation.value * parseFloat(impressionTime.value)
        const totalMaterialCost = parseFloat(impressionWeight.value) / 1000 * parseFloat(filamentSelected.value)
        subtotal.value = totalEnergy + totalDeprecation + totalMaterialCost + workingCost + postprocessingCost
        subtotalWithProfit.value = Math.round(( (subtotal.value * ( 1 + (profit.value / 100))) - subtotal.value) * 100) / 100
        totalTax.value =  Math.round( ((subtotalWithProfit.value +  subtotal.value) * tax.value / 100) * 100) / 100
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
      }
      return {
        impressionTime,
        filamentSelected,
        filamentList,
        impressionWeight,
        tax, profit,
        calculate, restart,
        subtotal, subtotalWithProfit, totalTax, total
      }
    }
  }).mount('#app')