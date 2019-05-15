import Crucial, { CruComponent, Component } from '../crucial'

@CruComponent.New
export default class Header extends Component {
    protected Template(): string {
        return (`
            header 
                h1 Header
                    c-question-box
        `)
        
    }   
}