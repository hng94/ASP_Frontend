import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {FaSignOutAlt} from "react-icons/fa";
import logoFH from "../../fh-kiel.png";
import "./Header.scss";

class Header extends Component {
  static propTypes = { user: PropTypes.object };
  render = () => {
    const { user } = this.props;
    return (
      <header>
        <Link to="/" className="header-title">
          <img src={logoFH} alt="logo" />
          &nbsp;Trollo
        </Link>
        <div className="header-right-side">
            {user.name}
            <a className="signout-link" href="/auth/signout">
              {/* <FaSignOutAlt className="signout-icon" /> */}
              Sign out
            </a>
        </div>
      </header>
    );
  };
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Header);
