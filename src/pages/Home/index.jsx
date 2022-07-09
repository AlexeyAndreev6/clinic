import * as React from 'react';
import {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import Photo from './img/homepage.jpg';
import './home.css';
import CloseIcon from '@mui/icons-material/Close';
import ModalAbout from './ModalAbout';
import Icon1 from './img/trust-icon-1.png';
import Icon2 from './img/trust-icon-2.png';
import Icon3 from './img/trust-icon-3.png';
import Icon4 from './img/trust-icon-4.png';
import Container from '@mui/material/Container';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
    {
        label: 'Акции для операции',
        imgPath:
            'https://sun7-9.userapi.com/s/v1/if2/kUepjlrpco7wpzP2DjQjVlYJAcAkPM8CBY-UN2GBeLwEKZ1T0ha9i8zQP8m7g-7BUc3_YZvwimWzQXHncQLr_Tvy.jpg?size=1240x648&quality=96&type=album',
    },
    {
        label: 'Акция ФГДС',
        imgPath:
            'https://sun9-83.userapi.com/s/v1/if2/ANMZsU9QDf1EwM4A7ykTIWp0CAhzeBPTxRs5TMLizpsysrJgsjWlu96w6SausshK8hIGx_uCekbRxzyliZ9pb8HO.jpg?size=1921x677&quality=96&type=album',
    },
    {
        label: 'Акции косметлогические услуги',
        imgPath:
            'https://sun9-47.userapi.com/s/v1/if2/PSRWEqcKLIBhcq-zmFtd0uZMexs8XTJVHHW2lEmzf31pZyXiFabyOACGg0gkvcrGieWAawkcz1SgMf4BpYRZv8L_.jpg?size=1240x648&quality=96&type=album',
    },
    {
        label: 'Covid-19',
        imgPath:
            'https://sun9-76.userapi.com/s/v1/if2/aJPRuBj3QU-YdL4rWgoJvQX4t7ccX8aPXj3gJSDwfUCWaAIJfMXmIEZEAHw3CKyRouqmckQQu0bOwleIyZB0tZAE.jpg?size=1920x677&quality=96&type=album',
    },
];

function SwipeableTextMobileStepper() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const [modalActive, setModalActive] = useState(false)
    return (
        <div>
            <div>
                <h1> О поликлинике</h1>
                <div className='homepage'>
                    <div className='photo'>
                        <img src={Photo} width={500}></img>
                    </div>
                    <div>
                        <div className='about'>
                            Поликлиника - это сочетание добросовестного отношения к работе, значительного
                            профессионального опыта и передовых технологий, что позволяет врачам клиники не только
                            оказывать конкретную помощь пациенту, но и сохранять его здоровье на долгие годы.
                        </div>
                        <div className='knopka'>
                            <button type="submit" className="btn-sub" onClick={(ev) => {
                                setModalActive(true);
                            }}>
                                Подробнее
                            </button>
                        </div>
                    </div>
                </div>
                <ModalAbout active={modalActive} setActive={setModalActive}>
                    <div className='CloseIcon'><CloseIcon className='Close'
                                                          onClick={() => setModalActive(false)}></CloseIcon></div>
                    <div className='modalCardText'>
                        <div className="titleModal">
                            <h2>О нас</h2>
                        </div>
                        <div className='grid-icons'>
                            <div className='textModal'>
                                <p> Поликлиника имеет удобное месторасположение и график работы, оснащенная передовой
                                    медицинской техникой лучших мировых производителей, для диагностики и лечения
                                    заболеваний, в том числе и на ранней стадии. Наши специалисты помогают не только
                                    диагностировать широкий спектр заболеваний, но и провести эффективное лечение с
                                    применением новейших медицинских технологий.</p>
                                <p> Сочетание добросовестного отношения к работе, значительного профессионального опыта
                                    и передовых технологий позволяет врачам медицинских центров оказывать конкретную
                                    необходимую помощь пациенту и сохранять его здоровье на долгие годы.</p>
                            </div>
                            <div className='icons'>
                                <div className='icons-text'>
                                    <img src={Icon1} width={92}></img>
                                    <span> Экономия времени </span>
                                </div>
                                <div className='icons-text'>
                                    <img src={Icon2} width={92}></img>
                                    <span> Доступная стоимость услуг </span>
                                </div>
                                <div className='icons-text'>
                                    <img src={Icon3} width={92}></img>
                                    <span> Квалифицированные специалисты </span>
                                </div>
                                <div className='icons-text'>
                                    <img src={Icon4} width={92}></img>
                                    <span> Применение эффективных методов </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalAbout>
            </div>
            <div>
                <Container>
                    <Box sx={{maxWidth: 1300, flexGrow: 1, margin: 5}}>
                        <Paper
                            square
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: "center",
                                height: 50,
                                pl: 2,
                                bgcolor: 'background.default',
                            }}
                        >
                            <Typography>{images[activeStep].label}</Typography>
                        </Paper>
                        <AutoPlaySwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={activeStep}
                            onChangeIndex={handleStepChange}
                            enableMouseEvents
                        >
                            {images.map((step, index) => (
                                <div key={step.label}>
                                    {Math.abs(activeStep - index) <= 2 ? (
                                        <Box
                                            component="img"
                                            sx={{
                                                height: 400,
                                                display: 'block',
                                                maxWidth: 1300,
                                                overflow: 'hidden',
                                                width: '100%',
                                            }}
                                            src={step.imgPath}
                                            alt={step.label}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </AutoPlaySwipeableViews>
                        <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                                <Button
                                    size="small"
                                    onClick={handleNext}
                                    disabled={activeStep === maxSteps - 1}
                                >
                                    Вперёд
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft/>
                                    ) : (
                                        <KeyboardArrowRight/>
                                    )}
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight/>
                                    ) : (
                                        <KeyboardArrowLeft/>
                                    )}
                                    Назад
                                </Button>
                            }
                        />
                    </Box>
                </Container>
            </div>
        </div>
    );
}

export default SwipeableTextMobileStepper;
