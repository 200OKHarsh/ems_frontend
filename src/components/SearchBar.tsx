import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Props {
  placeholder?: string;
  setSearch: (value: string) => void;
}

const SearchBar = (props: Props) => {
  return (
    <div className="relative">
      <Search className="absolute top-0 bottom-0 w-6 h-6 my-auto left-3" />
      <Input
        onChange={(e) => props.setSearch(e.target.value)}
        type="text"
        placeholder={props.placeholder ?? 'Search'}
        className="pl-12 pr-4"
      />
    </div>
  );
};

export default SearchBar;
