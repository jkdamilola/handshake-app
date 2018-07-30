
import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { BASE_API, API_URL } from '@/constants';
import { connect } from 'react-redux';
import { userAuthenticate } from '@/reducers/admin/action';


class Login extends React.Component {

  loginUser=(event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const email = data.get('email');
    const password = data.get('password');

    /*
    const auth = $http({
      url: `${BASE_API.BASE_URL}/cryptosign/auth`,
      data: {
        email,
        password,
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    });
    auth.then((response) => {
      if (response.data.status === 1) {
        const token = response.data.data.access_token;
        localStorage.setItem('Token', token);
        localStorage.setItem('TokenInit', new Date());
        this.setState({
          login: true,
        });
      }
    });
    */
    this.authenticateUser(email, password);
  }
  authenticateUser(email, password) {
    const params = {
      email,
      password,
    };

    this.props.userAuthenticate({
      PATH_URL: `${BASE_API.BASE_URL}/cryptosign/auth`,
      METHOD: 'POST',
      data: params,
    });
  }

  render() {
    return (
      <Form style={{ margin: '1em', WebkitAppearance: 'menulist' }} onSubmit={this.loginUser}>
        <FormGroup>
          <Label for="login">Login</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            required
          />
          <br />
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
          />
          <br />
          <Button type="submit">Submit</Button>
          <br />
        </FormGroup>
      </Form>
    );
  }
}

const mapState = state => ({

});
const mapDispatch = ({
  userAuthenticate,
});
export default connect(mapState, mapDispatch)(Login);
