import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
    return (
        <div className='loading-screen-wrapper'>
            <CircularProgress />
            <p className='loading-text'>Loading</p>
        </div>
    )
}