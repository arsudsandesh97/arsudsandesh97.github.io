import React from 'react'
import { useState } from 'react'
import { Container, Wrapper, Title, CardContainer, ToggleButtonGroup, ToggleButton, Divider } from './ProjectsStyle'
import ProjectCard from '../Cards/ProjectCards'
import { projects } from '../../data/constants'


const Projects = ({openModal,setOpenModal}) => {
  const [toggle, setToggle] = useState('all');
  return (
    <Container id="projects">
      <Wrapper>
        <Title>Projects</Title>
        <ToggleButtonGroup >
          {toggle === 'all' ?
            <ToggleButton active value="all" onClick={() => setToggle('all')}>All</ToggleButton>
            :
            <ToggleButton value="all" onClick={() => setToggle('all')}>All</ToggleButton>
          }
          <Divider />
          {toggle === 'Power Bi Dashboard' ?
            <ToggleButton active value="Power Bi Dashboard" onClick={() => setToggle('Power Bi Dashboard')}>Power Bi Dashboard</ToggleButton>
            :
            <ToggleButton value="Power Bi Dashboard" onClick={() => setToggle('Power Bi Dashboard')}>Power Bi Dashboard</ToggleButton>
          }
          <Divider />
          {toggle === 'EDA Using Python' ?
            <ToggleButton active value="EDA Using Python" onClick={() => setToggle('EDA Using Python')}>EDA Using Python</ToggleButton>
            :
            <ToggleButton value="EDA Using Python" onClick={() => setToggle('EDA Using Python')}>EDA Using Python</ToggleButton>
          }
          <Divider />
          {toggle === 'Excel Dashboard' ?
            <ToggleButton active value="Excel Dashboard" onClick={() => setToggle('Excel Dashboard')}>Excel Dashboard</ToggleButton>
            :
            <ToggleButton value="Excel Dashboard" onClick={() => setToggle('Excel Dashboard')}>Excel Dashboard</ToggleButton>
          }
        </ToggleButtonGroup>
        <CardContainer>
          {toggle === 'all' && projects
            .map((project) => (
              <ProjectCard project={project} openModal={openModal} setOpenModal={setOpenModal}/>
            ))}
          {projects
            .filter((item) => item.category == toggle)
            .map((project) => (
              <ProjectCard project={project} openModal={openModal} setOpenModal={setOpenModal}/>
            ))}
        </CardContainer>
      </Wrapper>
    </Container>
  )
}

export default Projects