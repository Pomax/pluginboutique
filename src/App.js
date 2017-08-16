import React, { Component } from 'react';
import './App.css';

function cisort(a,b) {
  a = a.product.name.toLowerCase();
  b = b.product.name.toLowerCase();
  return a < b ? -1 : a > b ? 1 : 0;
}

function getData() {
  let input =  require('./protected/formatted.json');
  // remap this data to an array
  const map = [];
  const keys = Object.keys(input);
  keys.forEach(key => {
    let data = input[key];
    data.key = key;
    map.push(data);
  });
  map.sort(cisort);
  return map;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      data: getData(),
      by_company: false
    }
  }

  showDownloadLinks(entry) {
    const dl = entry.downloads;
    const links = Object.keys(dl).map(key => {
      let platform = dl[key];
      return platform.map((d,i) => {
        return (
          <div key={key+i} className="download platform-{key}">
            <a href={d.url}>Download for {key}</a>
          </div>
        );
      });
    });
    return (
      <div className="download-links">
      { links }
      </div>
    );
  }

  sortByName() {
    let data = this.state.data;
    data.sort(cisort);
    this.setState({ data });
  }

  sortByCompany() {
    let names = {};
    let data = this.state.data
    data.forEach(e => {
      let name = e.product.manufacturer.name
      if (!names[name]) { names[name] = []; }
      names[name].push(e);
    });
    data = [];
    Object.keys(names).forEach(name => {
      data = data.concat(names[name]);
    });
    this.setState({ data, by_company: true });
  }

  generateProductList() {
    return this.state.data.map(entry => {
      let product = entry.product;
      let guides = product.guides.map(guide => {
        return <ol key={guide.link}>
          <a href={ guide.link }>{ guide.description }</a>
        </ol>
      });
      let version = entry.versions.map(v => v.version)[0];
      let bgimg = {
        backgroundImage: `url(${product.image_url})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center right'
      };
      let url = `http://pluginboutique.com${product.link_to}`;

      return (
        <div className={'product-entry'} key={product.name}>
          <div className={'image-overloy'}>
            <img src={product.image_url} alt=''/>
          </div>
          <h1><a href={url}>{product.name}</a> (v{ version })</h1>
          <h2>{ product.category.name } by { product.manufacturer.name }</h2>
          { guides }
          { this.showDownloadLinks(entry) }
        </div>
      );
    });
  }

  render() {
    let title = "Your PluginBoutique Software"
    let logo = "https://www.pluginboutique.com/assets/logo/logo_215x56-92d84416da6470c6103eb352697c7b42.png";
    return (
      <div className="App">
        <div className="App-header">
          <h2>
            <img className='logo' src={logo} alt=''/> {title}</h2>
        </div>

        <div className="buttons">
          <button onClick={() => this.sortByName()}>sort by name</button>
          <button onClick={() => this.sortByCompany()}>sort by company</button>
        </div>

        <div className="App-content products">
          { this.generateProductList() }
        </div>
      </div>
    );
  }
}

export default App;
