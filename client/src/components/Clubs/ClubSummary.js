import React from 'react'
import { Link } from 'react-router-dom'
import { CollectionItem, Icon } from 'react-materialize'

export const ClubSummary = props => (
    <CollectionItem>
        <Link to={"/clubs/" + props.club.club._id} className="title">{props.club.isOwner ? <Icon className="tiny">grade</Icon> : null}{props.club.club.name}</Link>
        <span className="secondary-content">{props.club.club.frequency}</span>
    </CollectionItem>
)