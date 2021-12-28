import React, { Component } from "react";
import Identicon from "identicon.js";

class Navbar extends Component {
  render() {
    const account = this.props.account;
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="\"
          rel="noopener noreferrer"
        >
          SocialNetwork ~ Write.. Read.. Tip..
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            {this.props.account ? (
              <div>
                <img
                  className="ml-2"
                  width="30"
                  height="30"
                  src={`data:image/png;base64,${new Identicon(
                    this.props.account,
                    30
                  ).toString()}`}
                />
                <small className="text-secondary">
                  <small id="account">{" " + account}</small>
                </small>
              </div>
            ) : (
              <span></span>
            )}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
