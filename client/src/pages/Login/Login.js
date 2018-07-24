import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login'
import { Preloader, Button, Container } from 'react-materialize'
import './Login.css'
import AuthUserContext from '../../components/Session/AuthUserContext'

class Login extends Component {

    render() {
        if (!this.props.location) {
            return <span></span>
        }
        return (
            <AuthUserContext.Consumer>
                {
                    (context) => {
                        return context.userInfo ?
                            (
                                <Container>
                                    <h3>Hi, {context.userInfo.displayName}!</h3>
                                    <img alt={context.userInfo.displayName + "'s avatar"} className="circle" src={context.userInfo.avatar || "/images/default-avatar.png"} />
                                    <p>
                                        <Button onClick={context.logout}>Log out</Button>
                                    </p>
                                </Container>
                            )
                            :
                            (
                                <Container>
                                    <div className="valign-wrapper">
                                        <div className="center-align">
                                            {(context.loggedOut || !this.props.location.search.startsWith('?code')) ?
                                                <div>
                                                    <h3>Welcome to<br />Tasty Friends</h3>
                                                    <p>Please login with your Facebook account to get started.</p>
                                                </div>
                                                :
                                                null
                                            }
                                            <br />
                                            <FacebookLogin cssClass={(context.loggedOut || !this.props.location.search.startsWith('?code')) ? 'kep-login-facebook' : 'hidden'} icon="fa-facebook" appId={process.env.REACT_APP_FB_APP_ID} autoLoad={false} fields="name,email,picture" scope="public_profile,user_friends" callback={context.login} version="3.0" />
                                            {!(context.loggedOut || !this.props.location.search.startsWith('?code')) ?
                                                <div>
                                                    <h3>Logging in...</h3>
                                                    <Preloader />
                                                </div>
                                                :
                                                null}
                                        </div>
                                    </div>
                                </Container>
                            )
                    }
                }
            </AuthUserContext.Consumer>
        )
    }
}

export default Login