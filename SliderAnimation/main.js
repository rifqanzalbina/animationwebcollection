const setStyles = ({ target, h, w, x, y }) =>{
    if (h) target.style.height = h
    if (w) target.style.width = w
    target.style.transform = `translate(${x || 0}, ${y || 0})`
  }

  const elements = {
    body: document.querySelector('.wrapper'),
    platypus: {
      wrapper: document.querySelector('.platypus-wrapper'),
      body: document.querySelector('.platypus-body'),
      head: document.querySelector('.head'),
      beak: document.querySelector('.beak'),
      bodyMarker: document.querySelector('.platypus-body-marker'),
      headMarker: document.querySelector('.head-marker'),
      beakMarker: document.querySelector('.beak-marker'),
      tail: document.querySelector('.tail-wrapper'),
      eyes: document.querySelector('.eyes-wrapper'),
      legs: document.querySelectorAll('.leg'),
    },
    marker: document.querySelectorAll('.marker'),
  }

  const positionMarker = (i, pos) => {
    elements.marker[i].style.left = px(pos.x)
    elements.marker[i].style.top = px(pos.y)
  }

  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))

  const setAngle = ({ target, angle }) => {
    target.style.transform = `rotate(${angle}deg)`
  }

  const getTargetAngle = () =>{
    const { x, y } = getPlatypusBeakPos()
    return angle = radToDeg(Math.atan2(y - control.y, x - control.x)) - 90
  }
  
  const control = {
    x: null, 
    y: null,
    platypusTimer: null,
  }

  const getValueWithinBound = ({ value, min, max, buffer }) => {
    return value = value < (min - buffer)
    ? min - buffer
    : value > (max + buffer)
    ? max + buffer
    : value
  }

  const moveWithinBound = ({ target, boundary, pos, buffer }) => {
    const { left: hX, top: hY, width, height } = boundary.getBoundingClientRect()

    setStyles({ 
      target, 
      x: px(getValueWithinBound({
          value: pos.x - (target.clientWidth / 2),
          min: hX,
          max: hX + width - target.clientWidth,
          buffer: buffer.x
        }) - hX), 
      y: px(getValueWithinBound({
          value: pos.y - (target.clientHeight / 2),
          min: hY,
          max: hY + height - target.clientHeight,
          buffer: buffer.y
        }) - hY), 
    })
  }

  const movePlatypus = pos => {
    control.x = pos.x
    control.y = pos.y
    positionMarker(0, control)

    const { body, bodyMarker, wrapper, head, headMarker, beak, beakMarker, eyes, tail } = elements.platypus

    ;[
      { 
        target: body, 
        boundary: wrapper,
      },
      { 
        target: bodyMarker, 
        boundary: wrapper,
      },
      { 
        target: head, 
        boundary: body,
      },
      { 
        target: headMarker, 
        boundary: bodyMarker,
      },
      { 
        target: beak, 
        boundary: head,
        buffer: { x: 5, y: 3 }
      },
      { 
        target: beakMarker, 
        boundary: headMarker,
        buffer: { x: 5, y: 3 }
      },
      { 
        target: eyes.childNodes[1],
        boundary: eyes,
        buffer: { x: 5, y: 3 }
      }
    ].forEach(item => {
        moveWithinBound({
          target: item.target,
          boundary: item.boundary,
          pos: control,
          buffer: item.buffer || { x: 15, y: 15 } 
        })
      })

    setAngle({
      target: tail,
      angle: getTargetAngle() - 180
    })
  }

  const getPlatypusBeakPos = () => {
    const { x, y, width, height } = elements.platypus.beakMarker.getBoundingClientRect()
    return {
      x: x + (width / 2),
      y: y + (height / 2)
    }
  }

  const callPlatypusTowardsClick = () => {
    const { x, y } = elements.platypus.wrapper.getBoundingClientRect()
    const newX = control.x + (x - getPlatypusBeakPos().x)
    const newY = control.y + (y - getPlatypusBeakPos().y)

    positionMarker(1, {
      x: newX,
      y: newY
    })
    setStyles({
      target: elements.platypus.wrapper,
      x: px(newX),
      y: px(newY)
    })

    elements.platypus.legs.forEach(leg => {
      leg.classList.add('swim')
    })
    setTimeout(()=>{
      elements.platypus.legs.forEach(leg => {
        leg.classList.remove('swim')
      })
    }, 3000)
  }

  const positionPlatypus = () => {
    clearTimeout(control.platypusTimer)
    const { offsetWidth, offsetHeight } = elements.body
    control.x = offsetWidth / 2
    control.y = (offsetHeight / 2) - elements.platypus.wrapper.clientHeight

    callPlatypusTowardsClick()
    movePlatypus({
      x: control.x + 10,
      y: control.y + 100
    })
    control.platypusTimer = setTimeout(()=>{
      movePlatypus({
        x: control.x,
        y: control.y + 80
      })
    }, 2000)
  }


  elements.body.addEventListener('mousemove', e => movePlatypus({
    x: e.pageX,
    y: e.pageY
  }))
  window.addEventListener('click', callPlatypusTowardsClick)
  window.addEventListener('resize', positionPlatypus) 
  
  positionPlatypus()
