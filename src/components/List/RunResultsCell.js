import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { RunPageRoute } from '../../constants/routes'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

// Simple component for displaying table headers
const RunResultsCell = ({ runId, isHovering, showDialog }) => {
  if (isHovering) {
    return (
      <div
        className='flex items-center hover:underline cursor-pointer'
        onClick={showDialog}
      >
        <Link to={RunPageRoute.split(':')[0].concat(runId)}>
          <FontAwesomeIcon className='mr-1 text-sm' icon={faEdit} />
          Edit
        </Link>
      </div>
    )
  } else {
    return <div></div>
  }
}

RunResultsCell.propTypes = {
  results: PropTypes.string,
  showDialog: PropTypes.func.isRequired,
}

export default RunResultsCell
