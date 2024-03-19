import "./App.css";
import { open } from '@tauri-apps/api/dialog';
import {Input} from "@/components/ui/input"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Textarea} from "@/components/ui/textarea.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import React, {useRef, useState} from "react";

function App() {
    const [selectedPath, setSelectedPath] = useState<string>("");
    const videoFileExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    const formSchema = z.object({
        m3u8Url: z.string().url("Invalid URL. Must be a valid URL."),
        localM3u8File: z.string({invalid_type_error:"Invalid file name. Must be a valid m3u8 file name."}),
        workDir: z.string({invalid_type_error:"Invalid directory. Must be a valid directory."}),
        outputFilename: z.string().regex(
            new RegExp(`^.+\\.(${videoFileExtensions.join('|')})$`, 'i'),
            "Invalid file name. Must be a valid video file name with a common video file extension."
        ),
        encryptionMode: z.enum(['CBC', 'ECB']),
        key: z.string({invalid_type_error:"Invalid key. Must be a valid key."}),
        iv: z.string().optional(),
        baseUrl: z.string().url().optional(),
        headers: z.string().optional(),
        proxy: z.string().url().optional(),
        timeRangeStart: z.string().optional(),
        timeRangeEnd: z.string().optional(),
        maxThread: z.number().min(1, "Invalid max thread. Must be a positive integer."),
        retryCount: z.number().min(0, "Invalid retry count. Must be a non-negative integer."),
    })

    type FormValues = z.infer<typeof formSchema>
    const defaultValues: Partial<FormValues> = {
        m3u8Url: "",
        localM3u8File: "",
        workDir: "",
        outputFilename: "",
        encryptionMode: "CBC",
        key: "",
        iv: "",
        baseUrl: "",
        headers: "",
        proxy: "",
        timeRangeStart: "",
        timeRangeEnd: "",
        maxThread: 64,
        retryCount: 3,
    }
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: "onChange",
    })



    function onSubmit(data: FormValues) {

        console.log(JSON.stringify(data, null, 2))
    }

    const selectDir = useRef<HTMLInputElement>(null);
    async function selectFolder(event:React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try {
            const selected = await open({
                directory: true,
                multiple: false,
            });
            if (selected) {
                setSelectedPath(selected as string);
                console.log('Selected directory:', selected);
                // 这里你可以调用 Rust 函数处理 selected，例如上传到服务器等操作
            } else {
                console.log('No directory selected.');
            }
        } catch (error) {
            console.error('Error selecting directory:', error);
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSelectedPath(event.target.value);
    }

    return (
        <div className="flex justify-center p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
                    <FormField
                        control={form.control}
                        name="m3u8Url"
                        render={({field}) => (
                            <>
                                <FormItem>
                                    <FormLabel>m3u8 URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/xxx.m3u8" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The URL of the m3u8 file.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Local m3u8 file</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...form.register("localM3u8File")} />
                                    </FormControl>
                                    <FormDescription>
                                        The local m3u8 file.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Work directory</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-4">
                                            <Input type="text" value={selectedPath} onChange={handleChange} />
                                            <Button variant="secondary" onClick={selectFolder}>Select Directory</Button>
                                        </div>
                                    </FormControl>
                                    <Input type="file" className="invisible" webkitdirectory="" {...form.register("workDir")} ref={selectDir}/>
                                    <FormDescription>
                                        The work directory.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Output filename</FormLabel>
                                    <FormControl>
                                        <Input placeholder="output.mp4" {...form.register("outputFilename")} />
                                    </FormControl>
                                    <FormDescription>
                                        The output filename.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Encryption mode</FormLabel>
                                    <FormControl>
                                        <RadioGroup className="flex" defaultValue="CBC" {...form.register("encryptionMode")}>
                                            <RadioGroupItem value="CBC" id="CBC" aria-selected />
                                            <Label htmlFor="CBC" className="mr-4">CBC</Label>
                                            <RadioGroupItem value="ECB" id="ECB"/>
                                            <Label htmlFor="ECB">ECB</Label>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormDescription>
                                        The encryption mode.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Key</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Encryption Key" {...form.register("key")} />
                                    </FormControl>
                                    <FormDescription>
                                        The key.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>IV</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Initialization Vector (optional)" {...form.register("iv")} />
                                    </FormControl>
                                    <FormDescription>
                                        The initialization vector.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Base URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Base URL (optional)" {...form.register("baseUrl")} />
                                    </FormControl>
                                    <FormDescription>
                                        The base URL.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Headers</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Headers (optional)" {...form.register("headers")} />
                                    </FormControl>
                                    <FormDescription>
                                        The headers.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Proxy</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Proxy URL (optional)" {...form.register("proxy")} />
                                    </FormControl>
                                    <FormDescription>
                                        The proxy.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Time range start</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Time range start (optional)" {...form.register("timeRangeStart")} />
                                    </FormControl>
                                    <FormDescription>
                                        The time range start.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Time range end</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Time range end (optional)" {...form.register("timeRangeEnd")} />
                                    </FormControl>
                                    <FormDescription>
                                        The time range end.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Max thread</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...form.register("maxThread")} />
                                    </FormControl>
                                    <FormDescription>
                                        The max thread.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Retry count</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...form.register("retryCount")} />
                                    </FormControl>
                                    <FormDescription>
                                        The retry count.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            </>
                        )}
                    />
                    <div className="flex flex-row-reverse gap-4">
                        <Button type="submit">Start</Button>
                        <Button type="submit" variant="secondary">Stop</Button>
                    </div>
                </form>
            </Form></div>
    );
}

export default App;
