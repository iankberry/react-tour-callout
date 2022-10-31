import styled from '@emotion/styled'

type Props = {
    top?: string
}

export const CenteredContent = styled.div<Props>`
    position: absolute;
    top: ${props => props.top ? props.top : '50%'};
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
`