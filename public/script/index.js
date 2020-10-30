const sendCountry = document.querySelector("#sendCountry");
    var doughnutChart = document.getElementById('doughnutChart');
    var totalLinesChart = document.getElementById('totalChart');
    var deathsChart = document.getElementById('deathsChart');
    var recoveredChart = document.getElementById('recoveredChart');

    var myPieChart = new Chart(doughnutChart, {
        type: 'doughnut',
        data: {
            labels: [
                'New Confirmed',
                'New Deaths',
                'New Recovered'
            ],
            datasets: [{
                data: [{{countryData.newConfirmed}}, {{countryData.newDeaths}}, {{countryData.newRecovered}}],
                backgroundColor: [
                'rgb(36, 36, 64)',
                'rgb(133, 150, 167)',
                'rgb(167, 204, 204)'
                ]
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false
        }
    });

    var myLineChart = new Chart(totalLinesChart, {
			type: 'line',
			data: {
				labels: [{{monthData.daysList}}],
				datasets: [{
					label: 'Deaths',
                    backgroundColor: 'rgb(133, 150, 167)',
					borderColor: 'rgb(133, 150, 167)',
					data: [
						{{monthData.deathsList}}
					],
					fill: false
				}, {
					label: 'Recovered',
					fill: false,
					backgroundColor: 'rgb(167, 204, 204)',
					borderColor: 'rgb(167, 204, 204)',
					data: [
						{{monthData.recoveredList}}
					],
				}, {
					label: 'Confirmed',
					fill: false,
					backgroundColor: 'rgb(36, 36, 64)',
					borderColor: 'rgb(36, 36, 64)',
					data: [
						{{monthData.confirmedList}}
					],
				}]
			},
			options: {
				responsive: false,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
		});
    var myDeathsChart = new Chart(deathsChart, {
			type: 'line',
			data: {
				labels: [{{monthData.daysList}}],
				datasets: [{
					label: 'Deaths',
                    backgroundColor: 'rgb(133, 150, 167)',
					borderColor: 'rgb(133, 150, 167)',
					data: [
						{{monthData.deathsList}}
					],
					fill: false
				}]
			},
			options: {
				responsive: false,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
		});
    var myRecoveredChart = new Chart(recoveredChart, {
			type: 'line',
			data: {
				labels: [{{monthData.daysList}}],
				datasets: [{
					label: 'Recovered',
                    backgroundColor: 'rgb(167, 204, 204)',
					borderColor: 'rgb(167, 204, 204)',
					data: [
						{{monthData.recoveredList}}
					],
					fill: false
				}]
			},
			options: {
				responsive: false,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Days'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
		});