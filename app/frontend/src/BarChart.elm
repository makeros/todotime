module BarChart exposing (view)

import Axis
import DateFormat
import Html.Styled exposing (Html)
import Round
import Scale exposing (BandConfig, BandScale, ContinuousScale, defaultBandConfig)
import String
import Svg.Styled exposing (Svg, fromUnstyled, g, line, rect, style, styled, svg, text, text_)
import Svg.Styled.Attributes exposing (class, css, fill, height, stroke, strokeDasharray, strokeWidth, textAnchor, transform, viewBox, width, x, x1, x2, y, y1, y2)
import Time
import Tuple


w : Float
w =
    900


h : Float
h =
    300


padding : Float
padding =
    30


xScale : List ( Time.Posix, Float ) -> BandScale Time.Posix
xScale model =
    List.map Tuple.first model
        |> Scale.band { defaultBandConfig | paddingInner = 0.1, paddingOuter = 0.2 } ( 0, w - 2 * padding )


yScale : Float -> ContinuousScale Float
yScale maximumHeight =
    Scale.linear ( h - 2 * padding, 0 ) ( 0, maximumHeight )


dateFormat : Time.Posix -> String
dateFormat =
    DateFormat.format [ DateFormat.dayOfWeekNameAbbreviated ] Time.utc


dayOfWeekNumber : Time.Posix -> String
dayOfWeekNumber =
    DateFormat.format [ DateFormat.dayOfWeekNumber ] Time.utc


xAxis : List ( Time.Posix, Float ) -> Svg msg
xAxis model =
    fromUnstyled (Axis.bottom [] (Scale.toRenderable dateFormat (xScale model)))


yAxis : List ( Time.Posix, Float ) -> Svg msg
yAxis model =
    fromUnstyled (Axis.left [ Axis.tickCount 5 ] (yScale (highestValue model)))


isWeekendClass : String -> String -> String
isWeekendClass dayNumberString classNames =
    if List.member dayNumberString [ "0", "6" ] then
        classNames ++ " " ++ "weekend"

    else
        classNames


column : BandScale Time.Posix -> ( Time.Posix, Float ) -> Float -> Svg msg
column scale ( date, value ) maxHeight =
    --TODO: set different color for today column
    let
        columnWidth =
            Scale.bandwidth scale
    in
    g
        [ class (isWeekendClass (dayOfWeekNumber date) "column") ]
        [ rect
            [ x <| String.fromFloat (Scale.convert scale date)
            , y <| String.fromFloat (Scale.convert (yScale maxHeight) value)
            , width <| String.fromFloat (Scale.bandwidth scale)
            , height <| String.fromFloat (h - Scale.convert (yScale maxHeight) value - 2 * padding)
            ]
            []
        , text_
            [ x <| String.fromFloat (Scale.convert (Scale.toRenderable dateFormat scale) date - columnWidth / 2)
            , y <| String.fromFloat (Scale.convert (yScale maxHeight) value - 5)
            , textAnchor (String.fromFloat value)
            ]
            [ text <|
                if value == 0 then
                    ""

                else
                    String.fromFloat value
            ]
        ]


view : List ( Time.Posix, Float ) -> Html msg
view model =
    let
        maxHeight =
            highestValue model

        averagePoints =
            averageValue model
    in
    svg
        [ viewBox (List.map String.fromFloat [ 0, 0, w, h ] |> String.join " "), width "98%" ]
        [ style [] [ text barStyle ]
        , g [ transform ("translate(" ++ String.fromFloat padding ++ " " ++ String.fromFloat (h - padding) ++ ")") ] [ xAxis model ]
        , g [ transform ("translate(" ++ String.fromFloat padding ++ " " ++ String.fromFloat padding ++ ")") ] [ yAxis model ]
        , g [ transform ("translate(" ++ String.fromFloat padding ++ " " ++ String.fromFloat padding ++ ")"), class "series" ] <| List.map (\item -> column (xScale model) item maxHeight) model
        , g [ transform ("translate(" ++ String.fromFloat padding ++ " " ++ String.fromFloat (h - padding) ++ ")") ]
            [ line
                [ x1 "0"
                , y1 <| String.fromFloat -(h - Scale.convert (yScale maxHeight) averagePoints - 2 * padding)
                , x2 "95%"
                , y2 <| String.fromFloat -(h - Scale.convert (yScale maxHeight) averagePoints - 2 * padding)
                , strokeWidth "1"
                , stroke "blue"
                , strokeDasharray "5,5"
                ]
                []
            , text_
                [ x "93%"
                , y <| String.fromFloat -(h - Scale.convert (yScale maxHeight) averagePoints - 1.7 * padding)
                , textAnchor <| Round.round 2 averagePoints
                , fill "blue"
                ]
                [ text <| Round.round 2 averagePoints ]
            ]
        ]


highestValue : List ( Time.Posix, Float ) -> Float
highestValue model =
    List.map Tuple.second model
        |> List.maximum
        |> Maybe.withDefault 0


averageValue : List ( Time.Posix, Float ) -> Float
averageValue timeSeries =
    (List.map Tuple.second timeSeries
        |> List.sum
    )
        / toFloat (List.length timeSeries)


barStyle : String
barStyle =
    ".column rect, .column line { fill: #b33426; }\n.column:hover rect { fill: #b33400; }\n.column.weekend rect { fill: green }\n"