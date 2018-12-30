import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {FaSignOutAlt} from "react-icons/fa";
import logoFH from "../../fh-kiel.png";
import "./Header.scss";
import { userActions } from "../../actions";
import {history} from "../../helpers/history";
import { userService } from "../../services";

class Header extends Component {
  static propTypes = { user: PropTypes.object };
  signOut = () => {
    userService.logout()
    window.location.href = '/';
  }

  render = () => {
    const { user } = this.props;
    return (
      <header className="header">
        <Link to="/" className="header-title">
          <img src={logoFH} alt="logo" />
          &nbsp;Trollo
        </Link>
        <div className="header-right-side">
            {user.name}
            <a className="signout-link" onClick={this.signOut}>
              Sign out
            </a>
        </div>
      </header>
    );
  };
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Header);