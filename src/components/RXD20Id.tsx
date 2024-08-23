import styled from 'styled-components';
import { ColorThemeProps, Theme } from '../theme';
import { Text } from './Reusable';
import { TbCopy as CopyIcon } from "react-icons/tb";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 0;
  margin-top: 0.4rem;
  padding: 0 0;
  cursor: pointer;
`;

const TokenId = styled(Text)<ColorThemeProps>`
  font-size: 0.85rem;
  max-width: 16rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0;
  width: fit-content;
  color: ${({ theme }) => theme.gray};
`;

export const CopyButton = styled(CopyIcon)`
  width: 1.25rem;
  height: 1.25rem;
  top: 1.5rem;
  left: 1.5rem;
  cursor: pointer;
  color: white;
  margin-right: 0.1rem;
`;

export type RXD20IdProps = {
  theme: Theme;
  id: string;
  onCopyTokenId: () => void;
};

function showId(id: string) {
  return id.substring(0, 5) + '...' + id.substring(id.length - 6);
}

export const RXD20Id = (props: RXD20IdProps) => {
  const { id, theme, onCopyTokenId } = props;

  const copy = (e: any) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    onCopyTokenId();
  };
  return (
    <Container onClick={copy}>
      <CopyButton onClick={(e) => copy(e)} />
      <TokenId theme={theme} title={id}>
        {showId(id)}
      </TokenId>
    </Container>
  );
};
