import React, { Component } from 'react';
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Form, InputGroup, Col, Row, Button } from 'react-bootstrap';

export default class App extends Component {
	state = { loggedIn: false, type: '', blitzID: '', blitzPIN: '' };

	componentDidUpdate() {}
	handleSubmit = (e) => {
		e.preventDefault();
		console.log(this.state);
	};
	handleChange = (e) => {
		let val = e.target.value;
		let id = e.target.id;
		let state = this.state;
		state[id] = val;
		this.setState({ ...state });
	};
	render() {
		const { loggedIn, type, blitzID, blitzPIN } = this.state;
		if (loggedIn) return <div />;
		else
			return (
				<Container fluid>
        <h1>MODERATOR LOGIN</h1>
					<Card>
						<Card.Body>
							<Form
								onSubmit={() => {
									this.handleSubmit(event);
								}}
							>
								<Form.Row>
									<Col md={{ span: 6, offset: 3 }}>
										<Form.Group>
											<InputGroup>
												<InputGroup.Prepend>
													<InputGroup.Text id="inputGroupPrepend">blitz20@</InputGroup.Text>
												</InputGroup.Prepend>
												<Form.Control
													onChange={() => {
														this.handleChange(event);
													}}
													value={blitzID}
													id="blitzID"
													type="text"
													required={true}
													placeholder="ID"
												/>
											</InputGroup>
										</Form.Group>
									</Col>
								</Form.Row>
								<Form.Row>
									<Col md={{ span: 6, offset: 3 }}>
										<Form.Group>
											<Form.Control
												onChange={() => {
													this.handleChange(event);
												}}
												value={blitzPIN}
												id="blitzPIN"
												type="password"
												required={true}
												placeholder="PIN"
											/>
										</Form.Group>
									</Col>
								</Form.Row>
								<Row>
									<Col>
										<Button type="submit">Submit</Button>
									</Col>
								</Row>
							</Form>
						</Card.Body>
					</Card>
				</Container>
			);
	}
}
