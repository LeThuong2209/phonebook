const Notification = ({messages}) => {
    if (messages === null){
        return
    }

    if (String(messages).toLowerCase().includes('successfully')){
        return (
            <div className="success">
                {messages}
            </div>
        )
    }

    return (
        <div className="failed">
            {messages}
        </div>
    )
}

export default Notification