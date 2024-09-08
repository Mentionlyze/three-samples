const iframe = document.querySelector('iframe');

const samples: NodeListOf<HTMLElement> = document.querySelectorAll('.sample')

for (const sample of samples) {
    sample.addEventListener('click', () => {
        const target = sample.getAttribute('target')
        iframe!.src = './samples/' + target + '/index.html'
        document.querySelector('.active')!.classList.remove('active')
        sample.classList.add('active')
    })
}

(document.querySelector('.sample.active') as HTMLElement)!.click()
