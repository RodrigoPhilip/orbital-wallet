import { useEffect, useState } from 'react';
import { FaQuestionCircle as NoImageIcon } from 'react-icons/fa';
import mime from 'mime';
import { getFile } from '../utils/opfs';
import styled from 'styled-components';
import { Token } from '../db';

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoImage = styled(NoImageIcon)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  color: #555;
`;

export const TokenImage = ({ token, className }: { token: Token; className?: string }) => {
  const filename = `${token.ref}.${token.fileExt}`;
  const [data, setData] = useState<Uint8Array | undefined>();
  const type = mime.getType(filename);
  useEffect(() => {
    (async () => {
      const bytes = await getFile('icon', filename);
      if (bytes) setData(bytes);
    })();
  }, [filename]);

  if (!data || !type) return <NoImage className={className} />;
  return (
    <Image
      className={className}
      src={`data:${type};base64, ${btoa(String.fromCharCode(...new Uint8Array(data)))}`}
      alt="Token"
    />
  );
};
