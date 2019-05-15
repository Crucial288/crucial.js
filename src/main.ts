const _ = require('lodash')
import Crucial, { CruComponent, Component } from './crucial'
import Header from './components/Header'
import QuestionBox from './components/QuestionBox'
//import App from './App'

//const Header = require('./components/Header.ts')
// const QuestionBox = require('./components/QuestionBox')

(function(){
    const cru = new Crucial('body', {
       components: [Header, QuestionBox] 
    });

    //console.log(Header)
    //console.log(Header)
})();

class Button extends Component{
    count: number = 0;
    count2: number = 0;

    Template() {
        return /*html*/ `
            <div>
                <button class="one">Wow so like this? ${this.count | 0}</button>
                <button class="two">Wow so like this? ${this.count2 | 0}</button>
                <c-embedded></c-embedded>
            </div>
        `
    }

    Style() : string {
        return /*css*/`
            .one{
                background-color: red;
            }

            .two {
                background-color: green;
            }
        `
    }

    Binds() {
        this.container.querySelector('.one').addEventListener('click', () => {
            console.log('clicked');
            this.count++;
            this.Update();
        });

        this.container.querySelector('.two').addEventListener('click', () => {
            console.log('clicked');
            this.count2++;
            this.Update();
        });
    }
}

@CruComponent.New
class Embedded extends Component {
    Template() {
        return /*html*/ `
            <p class="one">Embedded</p>
            <c-deeper/>
        `
    }

    Style() {
        return( /*css*/`
            p {
                font-size: 3rem;
            }
        `)
    }
}

@CruComponent.New
class Deeper extends Component {
    Template() {
        return (/*html*/ `<p>Deeper</p>`)
    }
}

@CruComponent.New
class ButtonSpace extends Component {
    Template() {
        return (`
            <p>Spaaaaaaaaaaace</p>
        `)
    }

    Style() {
        return( /*css*/`
        `)
    }
}

@CruComponent.New
class Menu extends Component {

    Template() {
        return (/*pug*/`
            nav
                ul 
                    li Home
                    li About
                    li 
                        c-test-link
        `)
    }

    Style() {
        return (`

        `)
    }
}

@CruComponent.New
class TestLink extends Component {
    Created() {
        this.NewBind({selector:'a', event: 'click', action: () => {console.log('cool bind!')}})
    }

    Template() {
        return (/*pug*/`
            a(href="#") Test Link
        `)
    }

    Binds() {
        this.container.querySelector('a').addEventListener('click', function(){
            console.log('test link!')
        })
    }
}
