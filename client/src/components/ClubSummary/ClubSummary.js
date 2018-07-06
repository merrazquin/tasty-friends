import React from 'react'
import { Link } from 'react-router-dom'
import { CollectionItem } from 'react-materialize'

export const ClubSummary = props => (
    <CollectionItem>
        <Link to={"/club/" + props.club.club._id} className="title">{props.club.club.name}</Link>
        <span className="secondary-content">{props.club.club.frequency}</span>
    </CollectionItem>
)