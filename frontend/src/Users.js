import React from 'react';
// import fetch from 'node-fetch';

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
            loadingF: true,
        }
    };

    componentDidMount() {
        fetch('http://localhost:2017/rest/getposts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
            .then(response => {
                console.log({ response });
                this.setState({
                    response: response,
                    loadingF: false
                })
            }).catch((err) => this.setState({ loadingF: false }));
    }
    render() {
        const { loadingF, response } = this.state;
        if (loadingF) {
            return <div> bitch this is loading right now </div>
        }

        const Title = ({ title }) => <div>{title}</div>;
        const ListItem = ({ item }) => <Title title={item.title} />;
        return (
            <div>
                <ul>
                    {response.map(response1 =>
                        <li key={response1.id}><div><p >{response1.title}</p> {response1.content}</div><hr></hr></li>
                    )}
                </ul>
            </div>
        );
    }
}