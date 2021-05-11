import './AlertCard.scss'

export default function AlertCard(props) {
    
    return (
        <div className='dashboard-alert-card'>
            <h1>{props.title || ''}</h1>
            <p>{props.content || ''}</p>
        </div>    
    )
}