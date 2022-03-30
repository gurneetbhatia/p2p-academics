import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class QueryPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authors: [],
            resources: [],
            query: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        window.api.receive("return-query-results", (response) => {
            if (response) {
                this.setState({
                    authors: response.authors,
                    resources: response.resources
                });
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        window.api.send("send-query", {query: this.state.query});
    }

    handleChange(event) {
        if (event.target.id === 'query') {
            this.setState({query: event.target.value});
        }
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group className='mb-3' controlId="query">
                        <Form.Control value={this.state.query} onChange={this.handleChange} type="text" placeholder="Query..."></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary">Submit</Button>
                </Form>
            </div>
        );
    }
}

export default QueryPage;