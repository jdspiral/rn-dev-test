import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { Header } from './components/common/Header';
import { Spinner} from './components/common/Spinner';
import JobDeck from './components/JobDeck';
import axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Inploi extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 1,
            jobs: [],
            loading: true
        }
    }

    componentWillMount() {
        this.getPaginatedData()
    }

    makeRequest = ((response) => {
        console.log('makeRequest count: ' + this.state.count);

        return axios.get('https://test.inploi.me/jobs/' + this.state.count + '?token=' + response.data.access_token)
            .then((res) => res.data.browse)
            .then(this.displayResults)
    });

    displayResults = ((data) => {
        if (data) {
            this.setState({count: this.state.count + 1});
            data.map((job, index) => this.setState({ jobs: this.state.jobs.concat(job)}, this.getPaginatedData));
        } else {
            this.setState({ loading: false });
            console.log('All done!');
        }
    });

    handleError = ((error) => {
        console.log(error);
        return error
    });

    getToken = (count) => {
        console.log('getToken this.state.count: ' + this.state.count);
        return axios.post('https://test.inploi.me/token', {
            grant_type: "client_credentials",
            client_id: 'jdspiral@gmail.com',
            client_secret: 'dk5j4uafcF9dabEIpjjbOPTP'
        })
        .then((response) => response)
    }

    getPaginatedData = () => {
        return this.getToken(this.state.count)
            .then(this.makeRequest)
            .catch(this.handleError)
    }

    renderCard(job) {
        const image = 'https://res.cloudinary.com/chris-mackie/image/upload/w_' + SCREEN_WIDTH + '/v65484321354/';

        return (
            <Card
                key={job.id}
                title={"Job Role: " + job.role}
                image={{ uri: image + job.employer_img }}
                fontFamily="AvenirNext-Regular"
            >
                <Text
                    style={styles.row}
                    fontFamily="AvenirNext-Regular"
                >
                    {"Experience Level: " + job.experience}

                </Text>
                <Text
                    style={styles.row}
                    fontFamily="AvenirNext-Regular"
                >
                    {job.company}

                </Text>


                <Button
                    backgroundColor={"#D24A50"}
                    title="View "
                    buttonStyle={styles.button}
                >
                </Button>

            </Card>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Header headerText="inploi" />
                { this.state.loading ?
                    <Spinner size="small"/>
                    : <JobDeck
                        data={this.state.jobs}
                        renderCard={this.renderCard}
                    />
                }

            </View>
        );
    }
}

const styles = {
    button: {
        borderRadius: 3
    },
    row: {
        marginBottom: 10
    }
}

export default Inploi;