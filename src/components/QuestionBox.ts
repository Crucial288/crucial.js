import Crucial, { CruComponent, Component } from '../crucial'

@CruComponent.New
export default class QuestionBox extends Component {
    Created() {
        fetch('https://opentdb.com/api.php?amount=10&category=17&type=multiple', {
            method: 'get'
        })
        .then((r: any) => {
            r.json().then((r: any) => {
                console.log(r)
            })
        })
    }

    protected Template(): string {
        return (`
            h1 Question Box
        `)
    }   
}