import React, { Component } from "react";

function nameSort(a, b) {
  a = a.product.name.toLowerCase();
  b = b.product.name.toLowerCase();
  return a < b ? -1 : a > b ? 1 : 0;
}

function companySort(a, b) {
  a = a.product.manufacturer.name.toLowerCase();
  b = b.product.manufacturer.name.toLowerCase();
  return a < b ? -1 : a > b ? 1 : 0;
}

function getProductList(setState) {
  import(`./demo/demo.json`).then((productList) => {
//  import(`./protected/formatted.json`).then((productList) => {

    const copied = JSON.parse(JSON.stringify(productList));
    Object.entries(copied).forEach(([key, entry]) => {
      if (entry.serial_numbers) entry.serial_numbers.forEach(s => {
        s.serial_number_id = -1;
        s.values = [`RNDM-${(''+Math.random()).slice(2)}`];
      })
    });
    console.log(JSON.stringify(copied));

    const data = Object.keys(productList)
      .filter((key) => key == parseInt(key))
      .map((key) => {
        const value = productList[key];
        value.key = key;
        value.product.name = value.product.name
          .replace(/\([^)]+\) ?/g, ``)
          .toLowerCase();
        return value;
      })
      .sort(nameSort);

    setState({ data });
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getProductList((...args) => this.setState(...args));
  }

  showSerials(serial_numbers) {
    if (serial_numbers.length === 0) return;
    return (
      <div>
        <h2>Serials</h2>
        <ul>
          {serial_numbers.map((v) => v.values.map((v) => <li key={v}>{v}</li>))}
        </ul>
      </div>
    );
  }

  showDownloadLinks(entry) {
    const dl = entry.downloads;
    const links = Object.keys(dl).map((key) => {
      let platform = dl[key];
      return platform.map((d, i) => {
        return (
          <div key={key + i} className="download platform-{key}">
            <a href={`https://www.pluginboutique.com${d.url}`}>
              Download for {key}
            </a>
          </div>
        );
      });
    });
    return <div className="download-links">{links}</div>;
  }

  sortByName() {
    this.setState({
      data: this.state.data.sort(nameSort),
      by_company: false,
    });
  }

  sortByCompany() {
    this.setState({
      data: this.state.data.sort(companySort),
      by_company: true,
    });
  }

  generateProductList() {
    const data = this.getFilteredData();

    if (!data) return;

    return data.map((entry) => {
      let product = entry.product;
      let guides = product.guides.map((guide) => {
        return (
          <ol key={guide.link}>
            <a href={guide.link}>{guide.description}</a>
          </ol>
        );
      });
      let version = entry.versions.map((v) => v.version)[0];
      let url = `http://pluginboutique.com${product.link_to}`;

      let head = [
        <h1 className="name" key="name">{product.name}</h1>,
        <h1 className="company" key="category">{product.manufacturer.name}</h1>,
      ];

      if (this.state.by_company) {
        [head[1], head[0]] = [head[0], head[1]];
      }

      return (
        <li className="product-entry" key={product.name}>
          <div>
            <header>
              {head}
              <h3 className="category">{product.category.name}</h3>
              <h4>
                Current version:{" "}
                <a href={url}>
                  <span className="version">{version}</span>
                </a>
              </h4>
            </header>
            <div>
              <h2>Guides</h2>
              {guides}
            </div>
            {this.showSerials(entry.serial_numbers)}
            {this.showDownloadLinks(entry)}
          </div>
          <div className="image-overlay">
            <img src={product.image_url} alt="" />
          </div>
        </li>
      );
    });
  }

  filter(evt) {
    this.setState({
      filter: evt.target.value.toLowerCase(),
    });
  }

  getFilteredData() {
    let data = this.state.data;
    if (this.state.filter) {
      const f = this.state.filter;
      data = data.filter((v) => {
        const p = v.product;
        return (
          p.name.toLowerCase().includes(f) ||
          p.manufacturer.name.toLowerCase().includes(f)
        );
      });
    }
    return data;
  }

  render() {
    let title = "Your PluginBoutique Software";
    let logo =
      "https://www.pluginboutique.com/assets/logo/logo_215x56-1d815ff4a2f159196efb858648b5ef026f964445b295bcc6d657b15f12ded791.png";

    return (
      <div className="App">
        <div className="header">
          <h2>
            <a href="https://pluginboutique.com" target="_blank">
              <img className="logo" src={logo} alt="" />
            </a>
            {title}
          </h2>
          <p>
            Listing {this.state.data?.length} products. Filter for:{" "}
            <input
              type="search"
              value={this.state.filter}
              placeholder="type filter text here"
              onChange={(evt) => this.filter(evt)}
            />
          </p>
          <div className="buttons">
            <button onClick={() => this.sortByName()}>sort by name</button>
            <button onClick={() => this.sortByCompany()}>
              sort by company
            </button>
          </div>
        </div>

        <ul className="content products">{this.generateProductList()}</ul>
      </div>
    );
  }
}

export default App;
