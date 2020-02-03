import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
export default class Dash extends Component {
	state = { option: 0, eventSelected: '', eventArray: [], userSearchID: '', userArray: [] };
	proxy = 'http://localhost:8080';
	componentDidMount() {
		console.log(this.props);
		this.setState({ eventSelected: this.props.eventID[0] });
	}
	componentDidUpdate() {
		console.log(this.state);
	}
	handleEventSelect(e) {
		this.setState({ eventSelected: Number(e.target.value) });
	}
	handleEventSubmit(e) {
		let { eventSelected } = this.state;
		e.preventDefault();
		axios
			.post(this.proxy + '/eventdata', { eventID: eventSelected })
			.then((res) => {
				res = res.data;
				if (res.status) {
					this.setState({ eventArray: res.message });
				} else {
					alert('Internal Error!');
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}
	renderTable(arr) {
		let item = [];
		// console.log(arr);
		for (let i = 0; i < arr.length; i++) {
			let e = arr[i];
			// console.log(e);
			item.push(
				<tr>
					<td>{i + 1}</td>
					<td>{e.blitzID}</td>
					<td>{e.firstName + ' ' + e.lastName}</td>
					<td>{e.teamID}</td>
					<td>{e.teamName}</td>
					<td>{e.teamSize}</td>
					<td>{e.mob}</td>
					<td>{e.email}</td>
				</tr>
			);
		}
		return (
			<Table striped responsive bordered>
				<thead>
					<tr>
						<th>#</th>
						<th>Blitz ID</th>
						<th>Name</th>
						<th>Team ID</th>
						<th>Team Name</th>
						<th>Team Size</th>
						<th>Mobile</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>{item}</tbody>
			</Table>
		);
	}
	viewEvents() {
		let drop = [];
		const { eventArray } = this.state;
		for (let i = 0; i < this.props.eventName.length; i++)
			drop.push(
				<option id={this.props.eventID[i]} value={this.props.eventID[i]}>
					{this.props.eventName[i]}
				</option>
			);
		return (
			<div>
				<br />
				<h3>Events:</h3>
				<br />
				<form
					onSubmit={() => {
						this.handleEventSubmit(event);
					}}
				>
					<select
						onChange={() => {
							this.handleEventSelect(event);
						}}
					>
						{drop}
					</select>
					<button type="submit">Submit</button>
				</form>
				<div>{this.renderTable(eventArray)}</div>
			</div>
		);
	}
	handleUserChange(e) {
		this.setState({ userSearchID: e.target.value });
    }
    renderTableUser(arr)
    {
        return arr;
    }
    handleUserSubmit(e)
    {
        e.preventDefault();
        console.log(this.state.userSearchID);
    }
	viewUser() {
		const { userSearchID, userArray } = this.state;
		return (
			<div>
				<br />
				<h3>User:</h3>
				<br />
				<form
					onSubmit={() => {
						this.handleUserSubmit(event);
					}}
				>
					<input
						type="text"
						id="userSearchID"
						value={userSearchID}
						onChange={() => {
							this.handleUserChange(event);
						}}
					/>
					<button type="submit">Submit</button>
				</form>
				<div>{this.renderTableUser(userArray)}</div>
			</div>
		);
	}
	viewTransaction() {}
	viewAccomodation() {}
	display() {
		const { option } = this.state;
		switch (option) {
			case 0:
				return this.viewEvents();
			case 1:
				return this.viewUser();
			case 2:
				return this.viewTransaction();
			case 3:
				return this.viewAccomodation();
			default:
				return this.viewEvents();
		}
	}
	selectOption(option) {
		this.setState({ option, eventArray: [], userSearchID: '', userArray: [] });
	}
	render() {
		return (
			<div>
				<div>
					<Button
						onClick={() => {
							this.handleEventSelect({ target: { value: this.props.eventID[0] } });
							this.selectOption(0);
						}}
					>
						View Event Registrations
					</Button>
				</div>
				&nbsp;
				{this.props.id === 11 ? (
					<div>
						<Button
							onClick={() => {
								this.selectOption(1);
							}}
						>
							View User Details
						</Button>
						&nbsp;
						<Button
							onClick={() => {
								this.selectOption(2);
							}}
						>
							View/Approve Transactions
						</Button>
						&nbsp;
						<Button
							onClick={() => {
								this.selectOption(3);
							}}
						>
							View Accomodation List
						</Button>
						&nbsp;
					</div>
				) : null}
				{this.display()}
			</div>
		);
	}
}
