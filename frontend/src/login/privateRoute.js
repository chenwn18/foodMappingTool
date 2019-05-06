import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isLoggedIn} from "./auth";

export const PrivateRoute = ({component: Component, ...rest}) => (

    <Route
        {...rest}
        render={props =>
            isLoggedIn() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/",
                        state: {from: props.location}
                    }}
                />
            )
        }
    />
);