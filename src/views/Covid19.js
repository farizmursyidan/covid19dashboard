/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import axios from 'axios';
import Pagination from 'react-js-pagination';

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.js";

const API_URL = 'https://api.covid19api.com/';

class Covid19 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      countryList: [],
      countryPage: [],
      prevPage : 0,
      activePage : 1,
      totalData : 0,
      perPage : 10,
      pageRange : 5,
      newConfirmed : 'asc',
      totalConfirmed : 'asc',
      newDeaths : 'asc',
      totalDeaths : 'asc',
      newRecovered : 'asc',
      totalRecovered : 'asc',
      deathRate : 'asc',
      dataConfirmedCases : [],
      dataRecovered : [],
      dataDeaths : [],
      countryName : '',
      mostCases : []
    };
    this.getCountryList = this.getCountryList.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.searchCountry = this.searchCountry.bind(this);
    this.sortCountry = this.sortCountry.bind(this);
    this.compareNewConfirmed = this.compareNewConfirmed.bind(this);
    this.sortNewConfirmed = this.sortNewConfirmed.bind(this);
    this.compareTotalConfirmed = this.compareTotalConfirmed.bind(this);
    this.sortTotalConfirmed = this.sortTotalConfirmed.bind(this);
    this.compareNewDeaths = this.compareNewDeaths.bind(this);
    this.sortNewDeaths = this.sortNewDeaths.bind(this);
    this.compareTotalDeaths = this.compareTotalDeaths.bind(this);
    this.sortTotalDeaths = this.sortTotalDeaths.bind(this);
    this.compareNewRecovered = this.compareNewRecovered.bind(this);
    this.sortNewRecovered = this.sortNewRecovered.bind(this);
    this.compareTotalRecovered = this.compareTotalRecovered.bind(this);
    this.sortTotalRecovered = this.sortTotalRecovered.bind(this);
    this.compareDeathRate = this.compareDeathRate.bind(this);
    this.sortDeathRate = this.sortDeathRate.bind(this);
    this.getDataConfirmedCases = this.getDataConfirmedCases.bind(this);
    this.getDataRecovered = this.getDataRecovered.bind(this);
    this.getDataDeaths = this.getDataDeaths.bind(this);
    this.sortTenConfirmedCases = this.sortTenConfirmedCases.bind(this);
  }

  async getDataFromAPI(url) {
    try {
      let respond = await axios.get(API_URL+url, {
        headers: {'Content-Type':'application/json'}
      });
      if(respond.status >= 200 && respond.status < 300) {
        console.log("respond data", respond);
      }
      return respond;
    } catch(err) {
      let respond = err;
      console.log("respond data", err);
      return respond;
    }
  }

  getCountryList() {
    this.getDataFromAPI('summary').then(res => {
      if(res.data !== undefined) {
        const countries = res.data.Countries;
        console.log("Country List", countries);
        this.setState({totalData : countries.length});
        this.setState({countryList : countries});
        this.setState({mostCases : countries});
        this.state.countryList.sort(this.sortCountry);
        let i, countryPageContainer = [];
        for(i = 0; i < 10; i++) {
          countryPageContainer.push(this.state.countryList[i]);
        }
        this.setState({countryPage : countryPageContainer});
      }
    })
  }

  componentDidMount() {
    this.getCountryList();
    this.getDataConfirmedCases();
    this.getDataRecovered();
    this.getDataDeaths();
  }

  handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber});
    let x, countryPageContainer = [];
    let y;
    if(pageNumber*10 > this.state.countryList.length) {
      y = this.state.countryList.length;
    } else {
      y = pageNumber*10;
    }
    for(x = (pageNumber*10)-10; x < y; x++) {
      countryPageContainer.push(this.state.countryList[x]);
    }
    this.setState({countryPage : countryPageContainer});
  }

  searchCountry(e) {
    let value = e.target.value;
    if(value !== '') {
      let dataFilter = this.state.countryList;
      let countryFiltered = dataFilter.filter(item => item.Country.toLowerCase().indexOf(value) > -1);
      this.setState({countryPage : countryFiltered.slice(0, 10), totalData : 10});
    } else {
      let i, countryPageContainer = [];
      for(i = 0; i < 10; i++) {
        countryPageContainer.push(this.state.countryList[i]);
      }
      this.setState({countryPage : countryPageContainer, totalData : this.state.countryList.length});
    }
  }

  sortCountry(a, b) {
    const countryA = a.Country;
    const countryB = b.Country;
  
    let comparison = 0;
    if (countryA > countryB) {
      comparison = 1;
    } else if (countryA < countryB) {
      comparison = -1;
    }
    return comparison;
  }

  compareNewConfirmed() {
    let i, countryPageContainer = [];
    this.state.countryList.sort(this.sortNewConfirmed);
    if(this.state.newConfirmed === 'asc') {
      this.setState({newConfirmed : 'desc'});
    } else {
      this.setState({newConfirmed : 'asc'});
    }
    for(i = 0; i < 10; i++) {
      countryPageContainer.push(this.state.countryList[i]);
    }
    this.setState({countryPage : countryPageContainer, activePage : 1});
  }

  sortNewConfirmed(a, b) {
    const newConfirmedA = a.NewConfirmed;
    const newConfirmedB = b.NewConfirmed;
  
    let comparison = 0;
    if (newConfirmedA > newConfirmedB) {
      comparison = 1;
    } else if (newConfirmedA < newConfirmedB) {
      comparison = -1;
    }
    if(this.state.newConfirmed === 'asc') {
      return comparison;
    } else {
      return comparison*-1;
    }
  }

  compareTotalConfirmed() {
    let i, countryPageContainer = [];
    this.state.countryList.sort(this.sortTotalConfirmed);
    if(this.state.totalConfirmed === 'asc') {
      this.setState({totalConfirmed : 'desc'});
    } else {
      this.setState({totalConfirmed : 'asc'});
    }
    for(i = 0; i < 10; i++) {
      countryPageContainer.push(this.state.countryList[i]);
    }
    this.setState({countryPage : countryPageContainer, activePage : 1});
  }

  sortTotalConfirmed(a, b) {
    const totalConfirmedA = a.TotalConfirmed;
    const totalConfirmedB = b.TotalConfirmed;
  
    let comparison = 0;
    if (totalConfirmedA > totalConfirmedB) {
      comparison = 1;
    } else if (totalConfirmedA < totalConfirmedB) {
      comparison = -1;
    }
    if(this.state.totalConfirmed === 'asc') {
      return comparison;
    } else {
      return comparison*-1;
    }
  }

  compareNewDeaths() {
    let i, countryPageContainer = [];
    this.state.countryList.sort(this.sortNewDeaths);
    if(this.state.newDeaths === 'asc') {
      this.setState({newDeaths : 'desc'});
    } else {
      this.setState({newDeaths : 'asc'});
    }
    for(i = 0; i < 10; i++) {
      countryPageContainer.push(this.state.countryList[i]);
    }
    this.setState({countryPage : countryPageContainer, activePage : 1});
  }

  sortNewDeaths(a, b) {
    const newDeathsA = a.NewDeaths;
    const newDeathsB = b.NewDeaths;
  
    let comparison = 0;
    if (newDeathsA > newDeathsB) {
      comparison = 1;
    } else if (newDeathsA < newDeathsB) {
      comparison = -1;
    }
    if(this.state.newDeaths === 'asc') {
      return comparison;
    } else {
      return comparison*-1;
    }
  }

  compareTotalDeaths() {
    let i, countryPageContainer = [];
    this.state.countryList.sort(this.sortTotalDeaths);
    if(this.state.totalDeaths === 'asc') {
      this.setState({totalDeaths : 'desc'});
    } else {
      this.setState({totalDeaths : 'asc'});
    }
    for(i = 0; i < 10; i++) {
      countryPageContainer.push(this.state.countryList[i]);
    }
    this.setState({countryPage : countryPageContainer, activePage : 1});
  }

  sortTotalDeaths(a, b) {
    const totalDeathsA = a.TotalDeaths;
    const totalDeathsB = b.TotalDeaths;
  
    let comparison = 0;
    if (totalDeathsA > totalDeathsB) {
      comparison = 1;
    } else if (totalDeathsA < totalDeathsB) {
      comparison = -1;
    }
    if(this.state.totalDeaths === 'asc') {
      return comparison;
    } else {
      return comparison*-1;
    }
  }

  compareNewRecovered() {
    let i, countryPageContainer = [];
    this.state.countryList.sort(this.sortNewRecovered);
    if(this.state.newRecovered === 'asc') {
      this.setState({newRecovered : 'desc'});
    } else {
      this.setState({newRecovered : 'asc'});
    }
    for(i = 0; i < 10; i++) {
      countryPageContainer.push(this.state.countryList[i]);
    }
    this.setState({countryPage : countryPageContainer, activePage : 1});
  }

  sortNewRecovered(a, b) {
    const newRecoveredA = a.NewRecovered;
    const newRecoveredB = b.NewRecovered;
  
    let comparison = 0;
    if (newRecoveredA > newRecoveredB) {
      comparison = 1;
    } else if (newRecoveredA < newRecoveredB) {
      comparison = -1;
    }
    if(this.state.newRecovered === 'asc') {
      return comparison;
    } else {
      return comparison*-1;
    }
  }

  compareTotalRecovered() {
    let i, countryPageContainer = [];
    this.state.countryList.sort(this.sortTotalRecovered);
    if(this.state.totalRecovered === 'asc') {
      this.setState({totalRecovered : 'desc'});
    } else {
      this.setState({totalRecovered : 'asc'});
    }
    for(i = 0; i < 10; i++) {
      countryPageContainer.push(this.state.countryList[i]);
    }
    this.setState({countryPage : countryPageContainer, activePage : 1});
  }

  sortTotalRecovered(a, b) {
    const totalRecoveredA = a.TotalRecovered;
    const totalRecoveredB = b.TotalRecovered;
  
    let comparison = 0;
    if (totalRecoveredA > totalRecoveredB) {
      comparison = 1;
    } else if (totalRecoveredA < totalRecoveredB) {
      comparison = -1;
    }
    if(this.state.totalRecovered === 'asc') {
      return comparison;
    } else {
      return comparison*-1;
    }
  }

  compareDeathRate() {
    let i, countryPageContainer = [];
    this.state.countryList.sort(this.sortDeathRate);
    if(this.state.deathRate === 'asc') {
      this.setState({deathRate : 'desc'});
    } else {
      this.setState({deathRate : 'asc'});
    }
    for(i = 0; i < 10; i++) {
      countryPageContainer.push(this.state.countryList[i]);
    }
    this.setState({countryPage : countryPageContainer, activePage : 1});
  }

  sortDeathRate(a, b) {
    const deathRateA = Number(a.TotalConfirmed !== 0 ? (a.TotalDeaths / a.TotalConfirmed * 100).toFixed(2) : 0.00);
    const deathRateB = Number(b.TotalConfirmed !== 0 ? (b.TotalDeaths / b.TotalConfirmed * 100).toFixed(2) : 0.00);
  
    let comparison = 0;
    if (deathRateA > deathRateB) {
      comparison = 1;
    } else if (deathRateA < deathRateB) {
      comparison = -1;
    }
    if(this.state.deathRate === 'asc') {
      return comparison;
    } else {
      return comparison*-1;
    }
  }

  getDataConfirmedCases(country) {
    this.state.dataConfirmedCases.splice(0, this.state.dataConfirmedCases.length);
    this.state.dataRecovered.splice(0, this.state.dataRecovered.length);
    this.state.dataDeaths.splice(0, this.state.dataDeaths.length);
    this.state.countryName = 'Please Wait...';
    if(country === undefined) {
      country = 'indonesia';
    }
    this.getDataFromAPI('country/'+country+'/status/confirmed/live').then(res => {
      if(res.data !== undefined) {
        const dataConfirmedCases = res.data;
        let dataConfirmedCasesSliced = dataConfirmedCases.slice(-30);
        this.setState({dataConfirmedCases : dataConfirmedCasesSliced, countryName : dataConfirmedCases.length !== 0 && (dataConfirmedCases[0]['Country'])});
      }
    })
  }

  getDataRecovered(country) {
    if(country === undefined) {
      country = 'indonesia';
    }
    this.getDataFromAPI('country/'+country+'/status/recovered/live').then(res => {
      if(res.data !== undefined) {
        const dataRecovered = res.data;
        let dataRecoveredSliced = dataRecovered.slice(-30);
        this.setState({dataRecovered : dataRecoveredSliced});
      }
    })
  }

  getDataDeaths(country) {
    if(country === undefined) {
      country = 'indonesia';
    }
    this.getDataFromAPI('country/'+country+'/status/deaths/live').then(res => {
      if(res.data !== undefined) {
        const dataDeaths = res.data;
        let dataDeathsSliced = dataDeaths.slice(-30);
        this.setState({dataDeaths : dataDeathsSliced});
      }
    })
  }

  sortTenConfirmedCases(a, b) {
    const totalConfirmedA = a.TotalConfirmed;
    const totalConfirmedB = b.TotalConfirmed;
  
    let comparison = 0;
    if (totalConfirmedA > totalConfirmedB) {
      comparison = 1;
    } else if (totalConfirmedA < totalConfirmedB) {
      comparison = -1;
    }
    return comparison*-1;
  }

  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };

  render() {
    let covidChartOptions = {
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 10,
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
    };

    let labelData = [], dataCases = [], dataRecovered = [], dataDeaths = [];
    this.state.dataConfirmedCases.map((list, i) => {
      labelData.push(list.Date.substring(0,10));
      dataCases.push(list.Cases);
    });
    this.state.dataRecovered.map((list, i) => {
      dataRecovered.push(list.Cases);
    });
    this.state.dataDeaths.map((list, i) => {
      dataDeaths.push(list.Cases);
    });

    let covidChart = {
      data: canvas => {
        let ctx = canvas.getContext("2d");
    
        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors
    
        return {
          labels: labelData,
          datasets: [
            {
              label: "Confirmed Cases",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#1f8ef1",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: dataCases
            },
            {
              label: "Recovered",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#00d6b4",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#00d6b4",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#00d6b4",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: dataRecovered
            },
            {
              label: "Deaths",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#d048b6",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#d048b6",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#d048b6",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: dataDeaths
            }
          ]
        };
      },
      options: covidChartOptions
    };

    let labelBar = [], dataBar = [];
    let tenConfirmedCases = this.state.mostCases;
    tenConfirmedCases.sort(this.sortTenConfirmedCases);
    let tes = tenConfirmedCases.slice(0,10);
    tes.map((list, i) => {
      labelBar.push(list.Country);
      dataBar.push(list.TotalConfirmed);
    });

    let covidBar = {
      data: canvas => {
        let ctx = canvas.getContext("2d");
    
        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
        gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
        gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
        gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors
    
        return {
          labels: labelBar,
          datasets: [
            {
              label: "Confirmed Cases",
              fill: true,
              backgroundColor: gradientStroke,
              hoverBackgroundColor: gradientStroke,
              borderColor: "#d048b6",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: dataBar
            }
          ]
        };
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "#f5f5f5",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest"
        },
        responsive: true,
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent"
              },
              ticks: {
                suggestedMin: 60,
                suggestedMax: 120,
                padding: 20,
                fontColor: "#9e9e9e"
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent"
              },
              ticks: {
                padding: 20,
                fontColor: "#9e9e9e"
              }
            }
          ]
        }
      }
    };

    return (
      <>
        <div className="content">
          <Row>
            <Col lg="12" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Country List</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th className="text-center"><Input placeholder="🔍 COUNTRY" type="text" onChange={this.searchCountry} /></th>
                        <th className="text-center" style={{cursor: 'pointer'}} onClick={this.compareNewConfirmed}>New Confirmed {this.state.newConfirmed === 'asc' ? <i className="tim-icons icon-minimal-down" /> : <i className="tim-icons icon-minimal-up" />}</th>
                        <th className="text-center" style={{cursor: 'pointer'}} onClick={this.compareTotalConfirmed}>Total Confirmed {this.state.totalConfirmed === 'asc' ? <i className="tim-icons icon-minimal-down" /> : <i className="tim-icons icon-minimal-up" />}</th>
                        <th className="text-center" style={{cursor: 'pointer'}} onClick={this.compareNewDeaths}>New Deaths {this.state.newDeaths === 'asc' ? <i className="tim-icons icon-minimal-down" /> : <i className="tim-icons icon-minimal-up" />}</th>
                        <th className="text-center" style={{cursor: 'pointer'}} onClick={this.compareTotalDeaths}>Total Deaths {this.state.totalDeaths === 'asc' ? <i className="tim-icons icon-minimal-down" /> : <i className="tim-icons icon-minimal-up" />}</th>
                        <th className="text-center" style={{cursor: 'pointer'}} onClick={this.compareNewRecovered}>New Deaths {this.state.newRecovered === 'asc' ? <i className="tim-icons icon-minimal-down" /> : <i className="tim-icons icon-minimal-up" />}</th>
                        <th className="text-center" style={{cursor: 'pointer'}} onClick={this.compareTotalRecovered}>Total Recovered {this.state.totalRecovered === 'asc' ? <i className="tim-icons icon-minimal-down" /> : <i className="tim-icons icon-minimal-up" />}</th>
                        <th className="text-center" style={{cursor: 'pointer'}} onClick={this.compareDeathRate}>Death Rate {this.state.deathRate === 'asc' ? <i className="tim-icons icon-minimal-down" /> : <i className="tim-icons icon-minimal-up" />}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.countryList.length === 0 && (
                        <tr>
                          <td colSpan="7">Loading...</td>
                        </tr>
                      )}
                      {this.state.countryPage.map((list, i) => 
                        <tr key={list.CountryCode}>
                          <td onClick={() => {this.getDataConfirmedCases(list.Slug); this.getDataRecovered(list.Slug); this.getDataDeaths(list.Slug);}} style={{cursor: 'pointer'}}><a href='#case-chart'>{list.Country}</a></td>
                          <td className="text-center">{list.NewConfirmed}</td>
                          <td className="text-center">{list.TotalConfirmed}</td>
                          <td className="text-center">{list.NewDeaths}</td>
                          <td className="text-center">{list.TotalDeaths}</td>
                          <td className="text-center">{list.NewRecovered}</td>
                          <td className="text-center">{list.TotalRecovered}</td>
                          <td className="text-center"><span style={{color: 'red'}}>{list.TotalConfirmed !== 0 ? (list.TotalDeaths / list.TotalConfirmed * 100).toFixed(2) : '0.00'}%</span></td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.perPage}
                    totalItemsCount={this.state.totalData}
                    pageRangeDisplayed={this.state.pageRange}
                    onChange={this.handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row id='case-chart'>
            <Col lg="12">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">{this.state.countryName}</h5>
                  <CardTitle tag="h3">
                    Covid-19 Cases
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={covidChart.data}
                      options={covidChart.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h3">
                    Top 10 Countries With Most Confirmed Cases
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Bar
                      data={covidBar.data}
                      options={covidBar.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Covid19;