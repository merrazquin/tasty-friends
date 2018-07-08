import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login'
import { Row, Col, Preloader, Button } from 'react-materialize'
import './Login.css'
import AuthUserContext from '../../components/Session/AuthUserContext'

class Login extends Component {

    render() {
        return (
            <Row>
                <AuthUserContext.Consumer>
                    {
                        (context) => {
                            return context.userInfo ?
                                (
                                    <div>
                                        <h1>Hi, {context.userInfo.displayName}</h1>
                                        <img alt={context.userInfo.displayName + "'s avatar"} className="circle" src={context.userInfo.avatar || "/default-avatar.png"} />
                                        <p>
                                            <Button onClick={context.logout}>Log out</Button>
                                        </p>
                                    </div>
                                )
                                :
                                (
                                    <Col s={12}>
                                        <FacebookLogin cssClass={context.loggedOut ? 'kep-login-facebook' : "hidden"} icon="fa-facebook" appId={process.env.REACT_APP_FB_APP_ID} autoLoad={true} fields="name,email,picture" scope="public_profile,user_friends" callback={context.login} />
                                        {context.loggedOut ? '' : <Preloader />}
                                    </Col>
                                )
                        }
                    }
                </AuthUserContext.Consumer>
            </Row>
        )
    }
}

export default Login