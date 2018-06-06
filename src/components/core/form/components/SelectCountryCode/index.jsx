import React from "react";
import COUNTRIES from "@/data/country-dial-codes.js";
import "./styles.scss";
import iconArrow from '@/assets/images/icon/Triangle.svg';

// const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length )

class SelectCountryCode extends React.Component {
  state = {
    showSelect: false,
    strFilterCountry: ''
  };

  // hideOnClickOutside = (element) => {
  //   const outsideClickListener = event => {
  //     if (!element.contains(event.target)) { // or use: event.target.closest(selector) === null
  //       if (isVisible(element)) {
  //         element.style.display = 'none'
  //         removeClickListener()
  //       }
  //     }
  //   }
  //
  //   const removeClickListener = () => {
  //     document.removeEventListener('click', outsideClickListener)
  //   }
  //
  //   document.addEventListener('click', outsideClickListener)
  // }
  // componentDidMount() {
  //   this.hideOnClickOutside(document.getElementById("#select-cc-wrapper"))
  // }

  toggleShowSelect = () => {
    // console.log('onrlube', a.target)
    this.setState({
      showSelect: !this.state.showSelect
    });
    if (!this.state.showSelect) {
      setTimeout(() => {
        this.selectListCountryCode.focus();
      }, 500);
    }
  };

  onItemClick = (dialCode) => {
    const { onChange } = this.props;
    onChange(dialCode);
    this.toggleShowSelect();
  };

  handleFilterChange = (e) => {
    this.setState({ strFilterCountry: e.target.value });
  }

  render() {
    const { countryCode, onChange } = this.props;
    const { showSelect, strFilterCountry } = this.state;
    const filteredCountries = COUNTRIES.filter(c => c.name.toUpperCase().includes(strFilterCountry.toUpperCase()));
    return (
      <span>
        <span className="select-country-code" onClick={this.toggleShowSelect}>
          {countryCode}
          <img className="ml-2" src={iconArrow} />
        </span>
        {
          showSelect && (
            <div className="select-list-country-code-wrapper" tabIndex="1" ref={(e) => { this.selectListCountryCode = e; }}>
              <div className="list">
                <div>
                  {
                    filteredCountries && filteredCountries.length > 0 ? filteredCountries.map((item, index) => {
                      const { dialCode, name, flag } = item;
                      return (
                        <div className="item" key={index}
                             onClick={() => this.onItemClick(dialCode)}>{flag} {name} ({dialCode})</div>
                      );
                    }) : (
                      <div>No data</div>
                    )
                  }
                </div>
              </div>
              <div className="mt-2 d-flex">
                <input type="text" value={strFilterCountry} className="form-control-custom form-control-custom-ex input-no-border" placeholder="Filter" onChange={this.handleFilterChange}/>
                <button onClick={this.toggleShowSelect} className="text-white btn btn-link ml-auto btn-close">Close</button>
              </div>
            </div>
          )
        }
      </span>
    );
  }
}

export default SelectCountryCode;