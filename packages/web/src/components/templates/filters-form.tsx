import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Select, SelectTrigger, SelectItem } from "@/components/ui/select.tsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx";
import { SlidersHorizontal } from "lucide-react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery.ts";
import { ControllerRenderProps } from "react-hook-form";
import { useEffect, useState } from "react";

interface Area {
  id: string;
  name: string;
  areas?: Area[];
}

const filtersSchema = z.object({
  salary: z.string()
    .refine(
      (val) => !val || Number(val) > 0,
      { message: "Зарплата должна быть больше 0" }
    )
    .optional(),
  experience: z.string().optional(),
  employment: z.array(z.string()).optional(),
  schedule: z.array(z.string()).optional(),
  only_with_salary: z.boolean().optional(),
  area: z.string().optional(),
});

export type FiltersSchema = z.infer<typeof filtersSchema>;

const experienceOptions = [
  { value: "noExperience", label: "Нет опыта" },
  { value: "between1And3", label: "От 1 года до 3 лет" },
  { value: "between3And6", label: "От 3 до 6 лет" },
  { value: "moreThan6", label: "Более 6 лет" },
];

const MOSCOW_REGION_ID = "2019";
const ALL_REGIONS = "1";

const employmentOptions = [
  { value: "full", label: "Полная занятость" },
  { value: "part", label: "Частичная занятость" },
  { value: "project", label: "Проектная работа" },
  { value: "volunteer", label: "Волонтерство" },
  { value: "probation", label: "Стажировка" },
];

const scheduleOptions = [
  { value: "fullDay", label: "Полный день" },
  { value: "shift", label: "Сменный график" },
  { value: "flexible", label: "Гибкий график" },
  { value: "remote", label: "Удаленная работа" },
  { value: "flyInFlyOut", label: "Вахтовый метод" },
];

interface FiltersFormProps {
  onSubmit: (data: FiltersSchema) => void;
  defaultValues?: FiltersSchema;
}

const FiltersForm = ({ onSubmit, defaultValues }: FiltersFormProps) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);

  const flattenAreas = (areas: Area[]): Area[] => {
    return areas.reduce((acc: Area[], area: Area) => {
      acc.push(area);
      if (area.areas && area.areas.length > 0) {
        acc.push(...flattenAreas(area.areas));
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch('https://api.hh.ru/areas');
        const data = await response.json();
        // Получаем регионы России (id: 113) и делаем плоский список
        const russianAreas = data.find((country: Area) => country.id === "113")?.areas || [];
        const flatAreas = flattenAreas(russianAreas);
        setAreas(flatAreas);
      } catch (error) {
        console.error('Failed to fetch areas:', error);
      } finally {
        setIsLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);

  const form = useForm<FiltersSchema>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      salary: defaultValues?.salary || "",
      experience: defaultValues?.experience,
      employment: defaultValues?.employment || [],
      schedule: defaultValues?.schedule || [],
      only_with_salary: defaultValues?.only_with_salary || false,
      area: defaultValues?.area || MOSCOW_REGION_ID,
    },
  });

  useEffect(() => {
    if (defaultValues?.area) {
      form.setValue('area', defaultValues.area);
    }
  }, [defaultValues?.area, form]);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const FiltersContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Регион</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onChange={field.onChange}
                >
                  <SelectTrigger 
                    placeholder={isLoadingAreas ? "Загрузка регионов..." : "Выберите регион"}
                    className={isLoadingAreas ? "opacity-50 pointer-events-none" : ""}
                  >
                    <SelectItem value="1">Москва</SelectItem>
                    {!isLoadingAreas && areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                    ))}
                  </SelectTrigger>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salary"
          render={({ field }: { field: ControllerRenderProps<FiltersSchema, "salary"> }) => (
            <FormItem>
              <FormLabel>Зарплата от</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Опыт работы</FormLabel>
              <FormControl>
                <Select value={field.value} onChange={field.onChange}>
                  <SelectTrigger placeholder="Выберите опыт">
                    {experienceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectTrigger>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employment"
          render={() => (
            <FormItem>
              <FormLabel>Тип занятости</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {employmentOptions.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="employment"
                    render={({ field }: { field: ControllerRenderProps<FiltersSchema, "employment"> }) => (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked: boolean) => {
                              const values = field.value || [];
                              return checked
                                ? field.onChange([...values, option.value])
                                : field.onChange(values.filter((value: string) => value !== option.value));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedule"
          render={() => (
            <FormItem>
              <FormLabel>График работы</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {scheduleOptions.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="schedule"
                    render={({ field }: { field: ControllerRenderProps<FiltersSchema, "schedule"> }) => (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked: boolean) => {
                              const values = field.value || [];
                              return checked
                                ? field.onChange([...values, option.value])
                                : field.onChange(values.filter((value: string) => value !== option.value));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="only_with_salary"
          render={({ field }: { field: ControllerRenderProps<FiltersSchema, "only_with_salary"> }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Только с указанной зарплатой
              </FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Применить фильтры
        </Button>
      </form>
    </Form>
  );

  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Фильтры поиска</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <FiltersContent />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <div className="w-full max-w-sm p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Фильтры поиска</h3>
      <FiltersContent />
    </div>
  );
};

export default FiltersForm; 