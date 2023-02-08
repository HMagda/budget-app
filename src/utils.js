export function customFetch(url, method, data) {
  fetch(url, {
    method: method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  })
    .then(() => {
      console.log('fetch', method);
    })
    .catch((error) => console.log(error));
}

export const updateChart = (
  setter,
  second_setter,
  keyword,
  xname,
  yname,
  style
) => {
  fetch('http://localhost:5000/' + keyword)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const x = data.map(function (dataArr) {
        return dataArr[xname];
      });

      const y = data.map(function (dataArr) {
        return dataArr[yname];
      });

      let formattedChartData = {
        labels: x,
        datasets: [y].map(function (value) {
          return {
            label: style.label,
            data: value,
            borderWidth: style.borderWidth,
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
          };
        }),
      };

      setter(data);
      second_setter(formattedChartData);
    });
};

export const updateChart2 = (
  setter,
  second_setter,
  keywords,
  xname,
  ynames,
  styles
) => {
  Promise.all([
    fetch('http://localhost:5000/' + keywords[0]).then((data) => data.json()),
    fetch('http://localhost:5000/' + keywords[1]).then((data) => data.json()),
  ])
    .then((data) => {
      let dataSets = [];
      let labels = [];
      let values = [];

      for (const indexOfData in data) {
        labels = data[indexOfData].map(function (dataArr) {
          return dataArr[xname];
        });

        values = data[indexOfData].map(function (dataArr) {
          return dataArr[ynames[indexOfData]];
        });

        const tempDataset = {
          label: styles[indexOfData].label,
          data: values,
          borderWidth: styles[indexOfData].borderWidth,
          borderColor: styles[indexOfData].borderColor,
          backgroundColor: styles[indexOfData].backgroundColor,
        };
        dataSets.push(tempDataset);
      }

      let formattedCombinedChartData = {
        labels: labels,
        datasets: dataSets,
      };

      setter(data);
      second_setter(formattedCombinedChartData);
    })
    .catch((err) => {
      console.log(err);
    });
};
