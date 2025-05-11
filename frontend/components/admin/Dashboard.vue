<script setup lang="ts">
    import { API } from '#imports'
    import cookie from 'js-cookie'
    import { ref, onMounted, computed } from 'vue'
    import RupiahFormat from '~/utils/RupiahFormat'
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import { Line } from 'vue-chartjs'
    import {
      Chart as ChartJS,
      Title,
      Tooltip,
      Legend,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale
    } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

    interface MonthlySale {
      month: string
      monthTotal: number
    }

    interface userDataProp {
      productCount: number
      commentCount: number
      reviewCount: number
      transactionTotal: number
      transactionCount: number
      monthlySales: MonthlySale[]
    }

    const meData = ref<userDataProp | null>(null)
    const chartKey = ref(0);
    const transactionTotalBefore = ref(0);
    const reviewTotalBefore = ref(0);
    const orderTotalBefore = ref(0);
    const productTotalBefore = ref(0);
    const selectedYear = ref<any>(2025)

    const chartData = ref({
      labels: [] as string[],
      datasets: [
        {
          label: 'The Orders (Rp)',
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          tension: 0.4,
          pointRadius: 4,
          data: [] as number[]
        }
      ]
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return 'Rp' + context.parsed.y.toLocaleString()
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: number | string) {
              if (typeof value === 'number') {
                return 'Rp' + value.toLocaleString()
              }
              return value
            }
          }
        },
        x: {
          ticks: {
            autoSkip: false
          }
        }
      }
    }

    const updateChart = () => {
      if (!meData.value?.monthlySales) return

      const monthlyMap = meData.value.monthlySales.reduce((acc, item) => {
        acc[item.month] = item.monthTotal
        return acc
      }, {} as Record<string, number>)
    
      const labels = generateAllMonths.value
      const data = labels.map(month => monthlyMap[month] || 0)
    
      chartData.value.labels = labels
      chartData.value.datasets[0].data = data
      chartKey.value++
    }

    const generateAllMonths = computed(() => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]

      return months.map(month => `${month} ${selectedYear.value}`)
    });

    watch(
      () => selectedYear.value,
      () => {
        updateChart()
      }
    )

    onMounted(async () => {
      const token = cookie.get('token');
      AOS.init();

      try {
        const response = await API.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        meData.value = response.data
        if (meData.value?.monthlySales) {
          const years = meData.value.monthlySales.map(item => {
            const [_, yearStr] = item.month.split(' ')
            return parseInt(yearStr)
          }).filter(Boolean)
        
          if (years.length > 0) {
            selectedYear.value = Math.max(...years)
          }

          updateChart();
        }

        const transactionDataTotal = meData.value?.transactionTotal ?? 0;
        const reviewDataCount = meData.value?.reviewCount ?? 0;
        const orderDataTotal = meData.value?.transactionCount ?? 0;
        const productDataTotal = meData.value?.productCount ?? 0;        

        chartKey.value++
        const transactionTotalInterval = setInterval(() => {
            if (transactionDataTotal > 0) {
                transactionTotalBefore.value+= 1000;
                if (transactionTotalBefore.value === transactionDataTotal) {
                    clearInterval(transactionTotalInterval);
                }
            } else {
              clearInterval(transactionTotalInterval);
            }
        }, 0);

        const reviewTotalInterval = setInterval(() => {
            if (reviewDataCount > 0) {
                reviewTotalBefore.value++;
                if (reviewTotalBefore.value === reviewDataCount) {
                  clearInterval(reviewTotalInterval);
                }
            } else {
              clearInterval(reviewTotalInterval);
            }
        }, 700);

        const orderTotalInterval = setInterval(() => {
            if (orderDataTotal > 0) {
                orderTotalBefore.value++;
                if (orderTotalBefore.value === orderDataTotal) {
                  clearInterval(orderTotalInterval);
                }
            } else {
              clearInterval(orderTotalInterval);
            }
        }, 700);

        const productTotalInterval = setInterval(() => {
            if (productDataTotal > 0) {
                productTotalBefore.value++;
                if (productTotalBefore.value === productDataTotal) {
                  clearInterval(productTotalInterval);
                }
            } else {
              clearInterval(productTotalInterval);
            }
        }, 700);        
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    });
</script>

<style scoped>
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
</style>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Dashboard</h1>
        <div class="overflow-x-scroll p-2 no-scrollbar">
            <div class="flex justify-start mt-8 items-center gap-6">
                <div class="flex text-black group hover:-translate-y-2 hover:scale-105 duration-300 justify-between relative flex-col bg-white drop-shadow-md w-[200px] lg:shrink shrink-0 lg:w-full h-[130px] rounded-md p-4 px-6 cursor-pointer">
                    <div class="flex items-center gap-3">
                        <svg class="w-[4px] h-auto" viewBox="0 0 5 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 3.98939C3.26558 3.98939 4.10465 3.22428 4.10465 2.28046C4.10465 1.33665 3.26558 0.571533 2.23055 0.571533C1.19551 0.571533 0.356445 1.33665 0.356445 2.28046C0.356445 3.22428 1.19551 3.98939 2.23055 3.98939Z"/>
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 10.8251C3.26558 10.8251 4.10465 10.06 4.10465 9.11616C4.10465 8.17234 3.26558 7.40723 2.23055 7.40723C1.19551 7.40723 0.356445 8.17234 0.356445 9.11616C0.356445 10.06 1.19551 10.8251 2.23055 10.8251Z"/>
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 17.6608C3.26558 17.6608 4.10465 16.8957 4.10465 15.9518C4.10465 15.008 3.26558 14.2429 2.23055 14.2429C1.19551 14.2429 0.356445 15.008 0.356445 15.9518C0.356445 16.8957 1.19551 17.6608 2.23055 17.6608Z"/>
                        </svg>
                        <p class="text-[14px] lg:text-[16px] font-poppins_medium group-hover:text-primary duration-300">Product Total</p>
                    </div>
                    <div class="flex justify-end items-center gap-2">
                        <p class="text-[24px] lg:text-[30px] ml-auto font-poppins_medium group-hover:text-primary duration-300">{{ productTotalBefore }}</p> 
                        <svg class="w-[26px] h-auto" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_227_586)">
                            <path class="fill-amber-600 group-hover:fill-primary duration-300" d="M14 13.6243V26.1902L13.125 26.6095L1.75 21.1717V7.54446L13.125 2.09357L24.5 7.54446V17.2932H22.75V9.43131L14 13.6243ZM13.125 3.98041L9.83008 5.55279L18.3203 9.66716L21.6699 8.06858L13.125 3.98041ZM12.25 24.3164V13.6243L3.5 9.43131V20.1234L12.25 24.3164ZM4.58008 8.06858L13.125 12.1568L16.3789 10.6106L7.875 6.49621L4.58008 8.06858ZM19.25 24.002V22.3248H28V24.002H19.25ZM19.25 18.9704H28V20.6476H19.25V18.9704ZM15.75 27.3564V25.6792H17.5V27.3564H15.75ZM15.75 20.6476V18.9704H17.5V20.6476H15.75ZM15.75 24.002V22.3248H17.5V24.002H15.75ZM19.25 27.3564V25.6792H28V27.3564H19.25Z"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_227_586">
                            <rect width="28" height="26.8352" fill="white" transform="translate(0 0.521179)"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
                <div class="flex text-black group hover:-translate-y-2 hover:scale-105 duration-300 justify-between relative flex-col bg-white drop-shadow-md w-[200px] lg:shrink shrink-0 lg:w-full h-[130px] rounded-md p-4 px-6 cursor-pointer">
                    <div class="flex items-center gap-3">
                        <svg class="w-[4px] h-auto" viewBox="0 0 5 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 3.98939C3.26558 3.98939 4.10465 3.22428 4.10465 2.28046C4.10465 1.33665 3.26558 0.571533 2.23055 0.571533C1.19551 0.571533 0.356445 1.33665 0.356445 2.28046C0.356445 3.22428 1.19551 3.98939 2.23055 3.98939Z"/>
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 10.8251C3.26558 10.8251 4.10465 10.06 4.10465 9.11616C4.10465 8.17234 3.26558 7.40723 2.23055 7.40723C1.19551 7.40723 0.356445 8.17234 0.356445 9.11616C0.356445 10.06 1.19551 10.8251 2.23055 10.8251Z"/>
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 17.6608C3.26558 17.6608 4.10465 16.8957 4.10465 15.9518C4.10465 15.008 3.26558 14.2429 2.23055 14.2429C1.19551 14.2429 0.356445 15.008 0.356445 15.9518C0.356445 16.8957 1.19551 17.6608 2.23055 17.6608Z"/>
                        </svg>
                        <p class="text-[14px] lg:text-[16px] font-poppins_medium group-hover:text-primary duration-300">Order Total</p>
                    </div>
                    <div class="flex justify-end items-center gap-2">
                        <p class="text-[24px] lg:text-[30px] ml-auto font-poppins_medium group-hover:text-primary duration-300">{{ orderTotalBefore }}</p> 
                        <svg class="w-[20px] h-auto" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="fill-emerald-600 group-hover:fill-primary duration-300" d="M5.04688 0.359375L6.07812 1.39062L3.32812 4.14062L2.8125 4.57031L2.29688 4.14062L0.921875 2.76562L1.95312 1.73438L2.8125 2.63672L5.04688 0.359375ZM8.3125 1.5625H17.25V2.9375H8.3125V1.5625ZM5.04688 5.85938L6.07812 6.89062L3.32812 9.64062L2.8125 10.0703L2.29688 9.64062L0.921875 8.26562L1.95312 7.23438L2.8125 8.13672L5.04688 5.85938ZM8.3125 7.0625H17.25V8.4375H8.3125V7.0625ZM5.04688 11.3594L6.07812 12.3906L3.32812 15.1406L2.8125 15.5703L2.29688 15.1406L0.921875 13.7656L1.95312 12.7344L2.8125 13.6367L5.04688 11.3594ZM8.3125 12.5625H17.25V13.9375H8.3125V12.5625Z"/>
                        </svg>
                    </div>
                </div>
                <div class="flex text-black group hover:-translate-y-2 hover:scale-105 duration-300 justify-between relative flex-col bg-white drop-shadow-md w-[200px] lg:shrink shrink-0 lg:w-full h-[130px] rounded-md p-4 px-6 cursor-pointer">
                    <div class="flex items-center gap-3">
                        <svg class="w-[4px] h-auto" viewBox="0 0 5 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 3.98939C3.26558 3.98939 4.10465 3.22428 4.10465 2.28046C4.10465 1.33665 3.26558 0.571533 2.23055 0.571533C1.19551 0.571533 0.356445 1.33665 0.356445 2.28046C0.356445 3.22428 1.19551 3.98939 2.23055 3.98939Z"/>
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 10.8251C3.26558 10.8251 4.10465 10.06 4.10465 9.11616C4.10465 8.17234 3.26558 7.40723 2.23055 7.40723C1.19551 7.40723 0.356445 8.17234 0.356445 9.11616C0.356445 10.06 1.19551 10.8251 2.23055 10.8251Z"/>
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 17.6608C3.26558 17.6608 4.10465 16.8957 4.10465 15.9518C4.10465 15.008 3.26558 14.2429 2.23055 14.2429C1.19551 14.2429 0.356445 15.008 0.356445 15.9518C0.356445 16.8957 1.19551 17.6608 2.23055 17.6608Z"/>
                        </svg>
                        <p class="text-[14px] lg:text-[16px] font-poppins_medium group-hover:text-primary duration-300">Review Total</p>
                    </div>
                    <div class="flex justify-end items-center gap-2">
                        <p class="text-[24px] lg:text-[30px] ml-auto font-poppins_medium group-hover:text-primary duration-300">{{ reviewTotalBefore }}</p> 
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-[22px] h-auto fill-amber-300 group-hover:fill-primary duration-300" viewBox="0 0 24 24"><path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"/></svg>
                    </div>
                </div>
                <div class="flex text-black group hover:-translate-y-2 hover:scale-105 duration-300 justify-between relative flex-col bg-white drop-shadow-md w-[200px] lg:shrink shrink-0 lg:w-full h-[130px] rounded-md p-4 px-6 cursor-pointer">
                    <div class="flex items-center gap-3">
                        <svg class="w-[4px] h-auto" viewBox="0 0 5 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 3.98939C3.26558 3.98939 4.10465 3.22428 4.10465 2.28046C4.10465 1.33665 3.26558 0.571533 2.23055 0.571533C1.19551 0.571533 0.356445 1.33665 0.356445 2.28046C0.356445 3.22428 1.19551 3.98939 2.23055 3.98939Z"/>
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 10.8251C3.26558 10.8251 4.10465 10.06 4.10465 9.11616C4.10465 8.17234 3.26558 7.40723 2.23055 7.40723C1.19551 7.40723 0.356445 8.17234 0.356445 9.11616C0.356445 10.06 1.19551 10.8251 2.23055 10.8251Z"/>
                            <path class="fill-black group-hover:fill-primary duration-300" fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 17.6608C3.26558 17.6608 4.10465 16.8957 4.10465 15.9518C4.10465 15.008 3.26558 14.2429 2.23055 14.2429C1.19551 14.2429 0.356445 15.008 0.356445 15.9518C0.356445 16.8957 1.19551 17.6608 2.23055 17.6608Z"/>
                        </svg>
                        <p class="text-[14px] lg:text-[16px] font-poppins_medium group-hover:text-primary duration-300">Transaction Total</p>
                    </div>
                    <div class="flex justify-end items-center gap-2">
                        <p class="text-[18px] lg:text-[24px] ml-auto font-poppins_medium group-hover:text-primary duration-300">{{ RupiahFormat(transactionTotalBefore || 0) }}</p> 
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-[24px] h-auto fill-green-500 group-hover:fill-primary duration-300" viewBox="0 0 24 24"><path d="m10 10.414 4 4 5.707-5.707L22 11V5h-6l2.293 2.293L14 11.586l-4-4-7.707 7.707 1.414 1.414z"/></svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-12">
            <div class="flex flex-col gap-1">
                <h1 class="lg:text-[24px] text-[20px] font-poppins_medium">Report Order Transaction</h1>
                <p class="lg:text-[18px] text-primary text-[20px] font-poppins_regular">{{ RupiahFormat(transactionTotalBefore || 0) }}</p>
            </div>
            <div class=" overflow-y-scroll no-scrollbar">
                <div class="flex justify-start items-center mt-2 gap-2">
                  <label class="text-[14px] font-poppins_medium" for="">Year : </label>
                  <select class="text-[14px] border-1 outline-0 border-black rounded-md py-1 px-2 cursor-pointer" v-model="selectedYear">
                    <option selected value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                  </select>
                </div>
                <div v-if="meData?.monthlySales.length" class="mt-6 h-[500px] lg:w-full w-[800px]">
                  <Line :key="chartKey" :data="chartData" :options="chartOptions" />
                </div>
                <div class="mt-8" v-else>
                  <p class="text-gray font-poppins_medium text-[24px]">Data not Found</p>
                </div>
            </div>
        </div>
    </section>
</template>