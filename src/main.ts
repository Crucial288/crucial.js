//import less = require('less');

class Crucial {
    private app : Element = null;

    constructor(id: string) {
        this.app = $(id);
        (window as any).app = this;
    }

}

abstract class Component {
    public container : Element = null;
    public element : Element = null;
    public uid : string = ''

    constructor(id: string) {
        console.log(id);
        this.container = $(id);

        this.uid = this.RandomID();

        this.container.classList.add(this.uid);

        this.Update();
    }

    protected abstract Template() : string;

    protected Render() {
        this.container.innerHTML = this.Template();

        if (!!this.Style()) {
            let scoped = `.${this.uid} {${this.Style()}}`

            less.render(scoped, (err, out) => {
                this.container.innerHTML += `<style>${out.css}</style>`
            })
        }
    }

    private RandomID() : string {
        return 'c' + Math.random().toString(36).substr(2);
    }

    Update() { 
        this.Render();
        this.Bind();
    }

    Bind() {

    }

    Style() : string {
        return '';
    }
}

class Button extends Component {
    count: number = 0;
    count2: number = 0;

    constructor(id: string) {
        super(id); 
    }

    Template() {
        return /*html*/ `
            <div>
                <button class="one">Wow so like this? ${this.count | 0}</button>
                <button class="two">Wow so like this? ${this.count2 | 0}</button>
            </div>
        `
    }

    Style() : string {
        return /*css*/`
            .one {
                background-color: red;
            }

            .two {
                background-color: green;
            }
        `.trim()
    }

    Bind() {
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

const $ = document.querySelector.bind(document);

(function(){
    const app = new Crucial('#app');

    //new Component('cru-button')
    new Button('cru-button')
})();

