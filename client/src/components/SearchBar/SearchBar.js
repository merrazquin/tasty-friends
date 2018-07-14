import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Input } from 'react-materialize'

import './SearchBar.css'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            errorMessage: '',
            latitude: null,
            longitude: null,
            isGeocoding: false,
        };
    }

    componentDidMount() {
        if (this.props.address.length) {
            this.setState({ address: this.props.address })
        }
    }

    handleChange = address => {
        const newState = {
            address,
            latitude: null,
            longitude: null,
            errorMessage: '',
        };
        this.setState(newState);
        this.props.onChange && this.props.onChange(newState)
    };

    handleSelect = selected => {
        this.setState({ isGeocoding: true, address: selected });
        geocodeByAddress(selected)
            .then(res => getLatLng(res[0]))
            .then(({ lat, lng }) => {
                this.setState({
                    latitude: lat,
                    longitude: lng,
                    isGeocoding: false,
                });
                this.props.onChange && this.props.onChange(this.state)
            })
            .catch(error => {
                this.setState({ isGeocoding: false });
                this.props.onChange && this.props.onChange(this.state)
            });
    };

    handleCloseClick = () => {
        const newState = {
            address: '',
            latitude: null,
            longitude: null,
        }
        this.setState(newState);
        this.props.onChange && this.props.onChange(newState)
    };

    handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status);
        this.setState({ errorMessage: status }, () => {
            clearSuggestions();
        });
    };

    render() {
        const {
            address
        } = this.state;
        return (
            <div>
                <PlacesAutocomplete
                    onChange={this.handleChange}
                    value={address}
                    onSelect={this.handleSelect}
                    onError={this.handleError}
                    shouldFetchSuggestions={address.length > 2}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                        return (
                            <div className="search-bar-container">
                                <div className="search-input-container">
                                    <Input
                                        {...getInputProps({
                                            placeholder: 'Search...',
                                            label: 'Default Hosting Location',
                                            className: 'search-input',
                                        })}
                                    />
                                    {this.state.address.length > 0 && (
                                        <button
                                            className="clear-button"
                                            onClick={this.handleCloseClick}
                                        >x</button>
                                    )}
                                </div>
                                {suggestions.length > 0 && (
                                    <div className="autocomplete-container">
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';

                                            return (
                                                /* eslint-disable react/jsx-key */
                                                <div
                                                    {...getSuggestionItemProps(suggestion, { className })}
                                                >
                                                    <strong>
                                                        {suggestion.formattedSuggestion.mainText}
                                                    </strong>{' '}
                                                    <small>
                                                        {suggestion.formattedSuggestion.secondaryText}
                                                    </small>
                                                </div>
                                            );
                                            /* eslint-enable react/jsx-key */
                                        })}
                                        <div className="dropdown-footer">
                                            <div>
                                                <img
                                                    src={require('../images/powered_by_google_default.png')}
                                                    className="dropdown-footer-image"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }}
                </PlacesAutocomplete>
            </div>
        );
    }
}

export default SearchBar;