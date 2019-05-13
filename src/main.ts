const _ = require('lodash')
//require('less/dist/less.min.js')

class Crucial {
    private app : Element = null;
    private nodes : Array<Element> = [];
    private components : Array<Component> = [];

    constructor(id: string) {
        this.app = $(id);
        (window as any).app = this;

        this.CreateComponents()
    }

    private CreateComponents() : void {
        /// Create array of all potential nodes in app
        let newNodes = Array.from(this.app.querySelectorAll('*'))
            .filter(n => n.nodeName.startsWith('C-'))

        /// Get all nodes that werent in previously stored nodes
        let differentNodes = newNodes.filter(n => !this.nodes.includes(n))

        /// Update stored nodes
        this.nodes = newNodes;

        //console.log(runtimeLess)

        //console.log(IComponent.Implementations())

        for (let node of differentNodes) {

            let name = node.nodeName.substring(2);
            //name = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase()
            name = _.startCase(name.toLowerCase()).replace(/ /g, '')

            let component : Component = null;

            for (let i of CruComponent.Implementations()) {
                if (i.name == name) {
                    component = new i(this, node)
                }
            }

            if (component == null) {
                console.warn(`Component with name: ${name} doesn't exist`)
                return
            }

            // try {
            //     component = new (window as any)[name](this, node)
            // } catch {
            //     /// Not a valid class to create
            //     console.warn(`Component with name: ${name} doesn't exist`)
            //     continue;
            // }

            this.components.push(component);
        }
    }

    public Update() {
        this.CreateComponents()
    }
}

/// Used to register components so we can find them.
/// Need a new way to do this.
namespace CruComponent {
    let implementations : any = [];

    export function Implementations(): Array<any> {
        return implementations;
    }

    export function New<T>(comp: T) {
        implementations.push(comp);
    }
}


abstract class Component {
    public container : Element = null;
    public uid : string = ''
    private app : Crucial;

    constructor(app : Crucial, container : Element) {
        this.app = app;

        //console.log(id);
        //this.container = $(id);
        this.container = container;

        this.uid = this.RandomID();
        //this.container.classList.add(this.uid);

        this.Update();
    }

    protected abstract Template() : string;

    protected Render() {
        console.log('render')

        this.container.innerHTML = this.Template();

        /// Add class names to elements for scoped css
        for (let child of Array.from(this.container.querySelectorAll('*'))) {
            if (child.nodeName.startsWith('C-')) {
                continue;
            }
            
            child.classList.add(this.uid);
        }

        /// Iterate through style string and manually add .uid to every element for scoped css
        if (!!this.Style().trim()) {
            let style = this.ScopedStyle()
            this.container.innerHTML += `<style>${style}</style>`
        }


        /// Replace [] in Style() with our .uid for scoped css
        /// Works but not super elegant? Lets us use both scoped and global (or component + children scope)
        // if (!!this.Style()) {
        //     let scoped = this.Style().replace(/\[]/g, `.${this.uid}`)
        //     this.container.innerHTML += `<style>${scoped}</style>`
        // }


        /// Use less to wrap css with the .uid class - this makes embedded component also inherit styles
        // if (!!this.Style()) {
        //     let scoped = `.${this.uid} {${this.Style()}}`

        //     less.render(scoped, (err, out) => {
        //         this.container.innerHTML += `<style>${out.css}</style>`
        //     })
        // }

        this.app.Update()
    }

    private ScopedStyle() : string {
        let style = this.Style()
        let c = ''

        for (let i = 0; i < style.length; i++) {
            c = style[i]
            
            if (c == '{') {
                /// Found {, go back until finding element and add scope
                let count = 0
                for (let b = i - 1; b > 0; b--) {
                    if (style[b] == ' ') {
                        count++
                        continue;
                    }
        
                    let p1 = style.substring(0, b + 1)
                    let p2 = style.substring(b + 1)
        
                    style = p1 + `.${this.uid}` + p2
                    i += this.uid.length + count + 1
                    
                    break;
                } 
            }
        }

        return style;
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

@CruComponent.New
class Button extends Component {
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
        return (/*html*/ `
            <p>Spaaaaaaaaaaace</p>
        `)
    }

    Style() {
        return( /*css*/`
        `)
    }
}

const $ = document.querySelector.bind(document);

(function(){
    const app = new Crucial('#app');
})();

