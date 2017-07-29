import React from 'react';
import _ from 'lodash';
import { Icon } from 'antd-mobile';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import Header from '../../atom_components/header';
import PhoneKeyboard from '../../atom_components/phone_keyboard';
import * as Service from '../../services/customer';

class Component extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line
    window.____info = this;
    const { location, history } = this.props;
    const { query } = location;
    const size = query.size * 1 || 0;
    const sizeInfo = {
      stroller: 0,
      highChair: 0,
      wheelChair: 0,
      carSeat: 0,
    };
    try {
      const sizeInfoParams = JSON.parse(query.sizeInfo);
      for (const [k] of Object.entries(sizeInfo)) {
        if (k in sizeInfoParams) {
          sizeInfo[k] = 1 * sizeInfoParams[k] || 0;
        }
      }
    }
    catch (e) {
      // do nothing
    }
    if (!size) {
      history.goBack();
    }
    this.state = {
      name: '',
      phone: '125-4563-8579',
      size,
      sizeInfo,
      mode: 'phone',
      // mode: 'name',
      submitting: false,
      submittingSuccess: false,
    };
  }

  submit = () => {
    const state = this.state;
    if (state.submitting) {
      return;
    }
    Service.create({
      name: state.name,
      phone: `${state.phone || ''}`.replace(/[^\d]*/g, ''),
      size: state.size,
      sizeInfo: state.sizeInfo,
    })
    .then((res) => {
      window.console.log(res);
      this.setState({
        submittingSuccess: true,
        submitting: false,
      });
    })
    .catch((rej) => {
      this.setState({
        submittingSuccess: false,
        submitting: false,
      });
      window.console.log(rej);
      // eslint-disable-next-line
      window.alert('Submit error, please retry.');
    });
  }

  render() {
    const { mode, name, phone } = this.state;
    const left = (<Link className="button" to="/size">
      <Icon type={require('../../svg/back.svg')} />
    </Link>);
    const right = (<div className="button ghost" onClick={this.submit}>
      Done
    </div>);

    const headerProps = {};
    if ('name' === mode) {
      headerProps.left = left;
      headerProps.right = right;
    }

    return (<div className={styles.normal}>
      <Header {...headerProps}>
        { 'name' === mode ? 'Name' : 'Phone Number'}
      </Header>
      {
        'phone' !== mode ? null : (<div className={styles.phoneKeyBoardContainer}>
          <div className={`${styles.stepBack} text-main`}>
            <Link to="/size" className="text-main">
              <Icon className="text-main" type={require('../../svg/back.svg')} />Back
            </Link>
          </div>
          <div className={`${styles.stepNext} text-main`} onClick={this.submit}>
            Done<Icon type={require('../../svg/forward.svg')} />
          </div>
          <PhoneKeyboard
            value={phone}
            onChange={(value) => {
              window.console.log('value', value);
              return this.setState({
                phone: value,
              });
            }}
          />
          <div className={styles.changeMode}>
            <Link
              className="text-main"
              onClick={() => {
                return this.setState({
                  phone: '',
                  mode: 'name',
                });
              }}
            >Do Not Have Phone With me ?</Link>
          </div>
        </div>)
      }
      {
        'name' !== mode ? null : (<div className={styles.userNameInputContainer}>
          <div className={styles.nameInput}>
            <div className={styles.nameInputIcon}>
              <Icon type={require('../../svg/user.svg')} />
            </div>
            <div className={styles.nameInputInput}>
              <input
                value={name}
                onChange={(e) => {
                  const value = _.get(e, 'target.value') || '';
                  return this.setState({
                    name: value,
                  });
                }}
              />
            </div>
          </div>
        </div>)
      }
    </div>);
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Component);
