export function customFetch(url: string, method: string, data: any) {
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
  setter: React.Dispatch<React.SetStateAction<any[]>>,
  second_setter: React.Dispatch<React.SetStateAction<any>>,
  keyword: string,
  xname: string,
  yname: string,
  style: {
    label: string;
    borderWidth: number;
    borderColor: string;
    backgroundColor: string[];
  }
) => {
  fetch('http://localhost:5000/' + keyword)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const x = data.map(function (dataArr: any) {
        return dataArr[xname];
      });

      const y = data.map(function (dataArr: any) {
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

export class GraphStyle {
  label: string;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string[];

  constructor(
    label: string,
    borderWidth: number,
    borderColor: string,
    backgroundColor: string[]
  ) {
    this.label = label;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
  }
}

export const updateChart2 = (
  setter: React.Dispatch<React.SetStateAction<any[]>>,
  second_setter: React.Dispatch<React.SetStateAction<any>>,
  keywords: string[],
  xname: string,
  ynames: string[],
  styles: GraphStyle[]
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
        labels = data[indexOfData].map(function (dataArr: any) {
          return dataArr[xname];
        });

        values = data[indexOfData].map(function (dataArr: any) {
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
