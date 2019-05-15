import Crucial, { CruComponent, Component } from './crucial'
const fetch = require('node-fetch')

@CruComponent.New
export default class App extends Component {
    Created() {
        console.log('app')

        fetch('https://opentdb.com/api.php?amount=10&category=17&type=multiple', {
            method: 'get'
        })
        .then((r: any) => {
            r.json().then((r: any) => {
                console.log(r)
            })
        })
    }

    Data() : Object {
        return {
            questions: []
        }
    }

    Template() : string {
        return (`
            .container
                c-header
                c-question-box
        `)
    }

    Style() : string {
        return (`
            .container {
                width: 1200px;
                margin: 0 auto;
                margin-top: 1rem;
                border-radius: .5rem;
                border: 1px solid #bbb;
                padding: 2rem;
            }
        `)
    }  
}