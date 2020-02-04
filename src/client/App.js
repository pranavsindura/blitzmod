import React, { Component } from 'react';
import axios from 'axios';
import Dash from './Dash';
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Form, InputGroup, Col, Row, Button } from 'react-bootstrap';

export default class App extends Component {
	state = { loggedIn: false, type: '', id: '', blitzPIN: '', eventID: [], eventName: [], modID: '' };
	// proxy = 'http://localhost:8080';
	proxy = '';
	componentDidUpdate() {}
	handleSubmit = (e) => {
		e.preventDefault();
		// console.log(this.state);
		const { id, blitzPIN } = this.state;
		axios
			.post(this.proxy + '/moderatorLogin', { id, blitzPIN })
			.then((res) => {
				res = res.data;
				// console.log(res);
				if (res.status) {
					this.setState({ loggedIn: true, modID: id, ...res.message });
				} else {
					alert(res.message);
				}
			})
			.catch((e) => console.log(e));
	};
	handleChange = (e) => {
		let val = e.target.value;
		let id = e.target.id;
		let state = this.state;
		state[id] = val;
		this.setState({ ...state });
	};
	handleLogout()
	{
		this.setState({ loggedIn: false, type: '', id: '', blitzPIN: '', eventID: [], eventName: [], modID: '' });
	}
	render() {
		const { loggedIn, modID, eventID, eventName, id, blitzPIN } = this.state;
		if (loggedIn) return (
			<Container fluid>
			<Button variant="danger" onClick={()=>{this.handleLogout()}}>Logout</Button>
			<br/>
		<Dash id={Number(modID)} eventID={eventID} eventName={eventName} />
		</Container>
		);
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
													value={id}
													id="id"
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
