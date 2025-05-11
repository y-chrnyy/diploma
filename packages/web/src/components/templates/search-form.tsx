import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { debounce } from "@/helpers/debounce.ts";
import { useCallback, useMemo } from "react";
const searchSchema = z.object({
  query: z.string().min(1, {
    message: "Поле поиска не должно быть пустым",
  }),
});

type SearchSchema = z.infer<typeof searchSchema>;

export interface SearchFormProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export const SearchForm = ({
  onSearch,
  placeholder = "Профессия, должность или компания",
  buttonText = "Найти",
}: SearchFormProps) => {
  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  const handleSubmit = (values: SearchSchema) => {
    onSearch(values.query);
  };

  const debouncedSearch = useMemo(() => debounce(onSearch, 1000), [onSearch]);

  const handleSearch = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full gap-2"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input 
                  placeholder={placeholder} 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleSearch(e.target.value);
                  }} 
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button type="submit">{buttonText}</Button>
      </form>
    </Form>
  );
};

export default SearchForm; 